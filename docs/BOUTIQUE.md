# Boutique — commandes vers Google Sheets + email

La page **/boutique** enregistre les commandes (sans paiement en ligne). Chaque
commande envoyée par le site est transmise à un petit script Google (Apps Script)
qui **ajoute une ligne par article dans un Google Sheet** et **t'envoie un email**.

Tu passes ensuite les commandes groupées une fois par mois depuis le Sheet.

---

## 1. Créer le Google Sheet + le script

1. Crée un Google Sheet (ex. « Commandes Boutique FC Littoral »).
2. Menu **Extensions → Apps Script**.
3. Supprime le code présent et colle celui-ci :

```javascript
// ⚙️ À personnaliser : ton adresse de réception des commandes.
const CLUB_EMAIL = "elio.hardouin@hotmail.com";
const SHEET_NAME = "Commandes";

function doPost(e) {
  try {
    const order = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(["Date", "N° commande", "Nom", "Prénom", "Téléphone",
        "Email", "Équipe", "Produit", "Taille", "Initiales", "Remarque"]);
    }
    const now = new Date();
    const orderId = Utilities.formatDate(now, "Europe/Paris", "yyyyMMdd-HHmmss");
    const c = order.customer || {};
    (order.items || []).forEach(function (it) {
      sheet.appendRow([
        Utilities.formatDate(now, "Europe/Paris", "yyyy-MM-dd HH:mm"),
        orderId,
        c.lastName || "", c.firstName || "", c.phone || "", c.email || "",
        c.team || "", it.name || it.slug || "", it.size || "",
        it.initials || "", c.note || ""
      ]);
    });

    const lines = (order.items || []).map(function (it) {
      return "• " + (it.name || it.slug) + " — taille " + (it.size || "?")
        + (it.initials ? " — flocage " + it.initials : "");
    }).join("\n");
    const body = "Nouvelle commande boutique\n\n"
      + "Client : " + (c.firstName || "") + " " + (c.lastName || "") + "\n"
      + "Tél : " + (c.phone || "-") + "   Email : " + (c.email || "-") + "\n"
      + (c.team ? "Équipe : " + c.team + "\n" : "")
      + "\nArticles :\n" + lines + "\n"
      + (c.note ? "\nRemarque : " + c.note + "\n" : "")
      + "\nN° commande : " + orderId;
    MailApp.sendEmail(CLUB_EMAIL,
      "🟡 Commande boutique — " + (c.firstName || "") + " " + (c.lastName || ""),
      body);

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Remplace `CLUB_EMAIL` par ton adresse si besoin.

## 2. Déployer le script en application web

1. En haut à droite : **Déployer → Nouveau déploiement**.
2. Type : **Application web**.
3. « Exécuter en tant que » : **moi**.
4. « Personnes qui ont accès » : **Tout le monde**.
5. Clique **Déployer**, autorise l'accès (Google demande une validation la 1re fois).
6. Copie l'**URL de l'application web** (finit par `/exec`).

## 3. Brancher l'URL sur le site

- **En local** : crée un fichier `.env.local` à la racine du projet :
  ```
  ORDER_WEBHOOK_URL=https://script.google.com/macros/s/xxxxx/exec
  ```
- **En production (Vercel)** : Project → **Settings → Environment Variables** →
  ajoute `ORDER_WEBHOOK_URL` avec la même URL, puis **redeploy**.

C'est tout : chaque commande apparaîtra comme de nouvelles lignes dans le Sheet
et tu recevras un email.

> Si `ORDER_WEBHOOK_URL` n'est pas défini, la commande n'est pas perdue : elle est
> journalisée dans les logs serveur (Vercel → Logs), mais **pense à configurer le
> webhook** pour recevoir Sheet + email.

---

## 4. Remplir le catalogue

Tout se règle dans **`data/products.ts`** :

- `price` : le tarif en euros (ex. `35`). Laisse `null` tant que le prix n'est pas
  fixé → le site affiche « — » et « À confirmer au club ».
- `sizes` : les tailles proposées. `[]` = taille unique (accessoires).
- `flocage` : `true` si l'article peut être personnalisé aux initiales.

Pour changer une photo produit : remplace le fichier dans `public/boutique/` en
gardant le même nom.
