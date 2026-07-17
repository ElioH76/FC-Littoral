# Boutique — commandes, Google Sheet & espace admin

La page **/boutique** enregistre les commandes (sans paiement en ligne). Chaque
commande est transmise à un script Google (Apps Script) qui :

- **ajoute une ligne par article** dans un onglet **« Commandes »** du Google Sheet,
- **t'envoie un email**,
- expose la liste des commandes et la mise à jour des statuts à la **page /admin**.

Tu passes les commandes groupées une fois par mois, et tu suis leur statut
(En attente → Commandée → Reçu → En attente de paiement → Payée → Annulée)
depuis l'espace admin du site (ou directement dans le Sheet).

---

## 1. Le script Apps Script (v2)

Dans ton Google Sheet : **Extensions → Apps Script**, remplace tout le code par
celui-ci :

```javascript
// ⚙️ À PERSONNALISER
const CLUB_EMAIL = "elio.hardouin@hotmail.com";
const SHEET_NAME = "Commandes";
// Secret : mets une longue chaîne aléatoire, IDENTIQUE à ORDER_WEBHOOK_TOKEN sur Vercel.
const TOKEN = "METS_UN_SECRET_ICI";

const HEADERS = ["Date", "N° commande", "Nom", "Prénom", "Téléphone", "Email",
  "Équipe", "Produit", "Taille", "Initiales", "Remarque", "Statut"];
const ORDERID_COL = 2;   // colonne B
const STATUS_COL = 12;   // colonne L
const DEFAULT_STATUS = "En attente";

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
  } else if (sheet.getRange(1, STATUS_COL).getValue() !== "Statut") {
    sheet.getRange(1, STATUS_COL).setValue("Statut");
  }
  return sheet;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function checkToken(t) { return TOKEN === "" || t === TOKEN; }

// Lister les commandes (appelé par /admin)
function doGet(e) {
  if (!checkToken(e.parameter.token)) return json({ ok: false, error: "unauthorized" });
  if (e.parameter.action !== "list") return json({ ok: false, error: "unknown_action" });
  const sheet = getSheet();
  const last = sheet.getLastRow();
  if (last < 2) return json({ ok: true, orders: [] });
  const rows = sheet.getRange(2, 1, last - 1, HEADERS.length).getValues();
  const map = {}, ids = [];
  rows.forEach(function (r) {
    const id = String(r[1]);
    if (!id) return;
    if (!map[id]) {
      map[id] = { orderId: id, date: String(r[0]), lastName: r[2], firstName: r[3],
        phone: String(r[4]), email: r[5], team: r[6], note: r[10],
        status: r[11] || DEFAULT_STATUS, items: [] };
      ids.push(id);
    }
    map[id].items.push({ name: r[7], size: r[8], initials: r[9] });
  });
  return json({ ok: true, orders: ids.map(function (id) { return map[id]; }) });
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (!checkToken(body.token)) return json({ ok: false, error: "unauthorized" });

    // Mise à jour d'un statut (appelé par /admin)
    if (body.action === "updateStatus") {
      const sheet = getSheet();
      const last = sheet.getLastRow();
      if (last >= 2) {
        const ids = sheet.getRange(2, ORDERID_COL, last - 1, 1).getValues();
        for (var i = 0; i < ids.length; i++) {
          if (String(ids[i][0]) === String(body.orderId)) {
            sheet.getRange(2 + i, STATUS_COL).setValue(body.status);
          }
        }
      }
      return json({ ok: true });
    }

    // Nouvelle commande
    const sheet = getSheet();
    const now = new Date();
    const orderId = Utilities.formatDate(now, "Europe/Paris", "yyyyMMdd-HHmmss");
    const c = body.customer || {};
    (body.items || []).forEach(function (it) {
      sheet.appendRow([
        Utilities.formatDate(now, "Europe/Paris", "yyyy-MM-dd HH:mm"),
        orderId, c.lastName || "", c.firstName || "", c.phone || "", c.email || "",
        c.team || "", it.name || it.slug || "", it.size || "", it.initials || "",
        c.note || "", DEFAULT_STATUS
      ]);
    });
    const lines = (body.items || []).map(function (it) {
      return "• " + (it.name || it.slug) + " — taille " + (it.size || "?")
        + (it.initials ? " — flocage " + it.initials : "");
    }).join("\n");
    MailApp.sendEmail(CLUB_EMAIL,
      "🟡 Commande boutique — " + (c.firstName || "") + " " + (c.lastName || ""),
      "Nouvelle commande boutique\n\nClient : " + (c.firstName || "") + " " + (c.lastName || "")
      + "\nTél : " + (c.phone || "-") + "   Email : " + (c.email || "-") + "\n"
      + (c.team ? "Équipe : " + c.team + "\n" : "") + "\nArticles :\n" + lines + "\n"
      + (c.note ? "\nRemarque : " + c.note + "\n" : "") + "\nN° commande : " + orderId);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}
```

- Remplace `CLUB_EMAIL` et surtout `TOKEN` par un secret long et aléatoire.

## 2. (Re)déployer le script

⚠️ **Après toute modif du code, il faut publier une nouvelle version** (sinon
l'URL `/exec` continue de servir l'ancien code) :

- **Déployer → Gérer les déploiements → (crayon) Modifier → Version : Nouvelle version → Déployer**
- Vérifie : « Exécuter en tant que » = **Moi**, « Personnes qui ont accès » = **Tout le monde**.
- L'URL `/exec` reste la même.

Si tu n'as pas encore de déploiement : **Déployer → Nouveau déploiement → Application web** (mêmes réglages), copie l'URL `/exec`.

## 3. Variables d'environnement (Vercel + local)

Sur **Vercel → Settings → Environment Variables** (cochées **Production**), puis
**Redeploy** :

| Variable | Valeur |
| --- | --- |
| `ORDER_WEBHOOK_URL` | l'URL `/exec` du script |
| `ORDER_WEBHOOK_TOKEN` | le **même** secret que `TOKEN` dans le script |
| `ADMIN_PASSWORD` | le mot de passe d'accès à `/admin` |

En local : copie `.env.example` en `.env.local` et renseigne les 3 valeurs.

> Sans `ORDER_WEBHOOK_TOKEN` = `TOKEN`, l'envoi de commande et l'admin renverront
> « unauthorized ». Les deux doivent être identiques.

---

## 4. Espace admin

- Accessible via le lien discret **« Admin »** en bas de page (footer), ou sur `/admin`.
- Protégé par `ADMIN_PASSWORD`.
- Liste toutes les commandes, filtrables par statut, avec coordonnées client,
  articles (taille + initiales) et un menu pour changer le statut.
- Le changement de statut est écrit dans la colonne **« Statut »** du Sheet — tu
  peux donc aussi gérer directement dans le Google Sheet si tu préfères.

---

## 5. Remplir le catalogue

Dans **`data/products.ts`** : `price` (€, `null` = « à confirmer »), `sizes`
(`[]` = taille unique), `flocage` (`true` = personnalisation initiales). Pour
changer une photo : remplace le fichier dans `public/boutique/` (même nom).
