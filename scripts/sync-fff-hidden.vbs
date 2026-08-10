' Lance sync-fff.bat SANS fenetre visible (utilise par la tache planifiee).
Dim sh, here
Set sh = CreateObject("WScript.Shell")
here = Left(WScript.ScriptFullName, InStrRev(WScript.ScriptFullName, "\"))
sh.Run """" & here & "sync-fff.bat""", 0, False
