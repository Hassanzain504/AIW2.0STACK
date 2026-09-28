# LinkedIn: Claude + Chromium setup

Claude aap ke computer par ek alag Chromium/Chrome window chalata hai. Us mein aap khud LinkedIn login karte hain. Claude profiles parhta hai, prospects ki list banata hai aur connection notes aur DMs likhta hai. **Send aap khud karte hain.**

Yeh setup is repo mein pehle se hai:
- `.mcp.json`: `linkedin-browser` naam ka Playwright MCP server, jis ka login profile `.browser-profiles/linkedin` mein save hota hai. Yeh folder git mein kabhi nahi jata.
- `.claude/settings.json`: page kholna aur parhna bina pooche hota hai. Har click aur typing se pehle Claude aap se ijazat maangta hai. Page par apna code chalana aur file upload band hain.
- `/linkedin-prospect`: command jo research karke `research/linkedin/prospects-<date>.md` mein drafts likhta hai.

## Ek dafa ka setup (aap ke computer par)

1. **Node.js** install karein (nodejs.org, LTS version).
2. **Google Chrome** installed hona chahiye. Agar nahi hai to terminal mein chalayein:
   ```
   npx playwright install chrome
   ```
3. **Claude Code** install karein (code.claude.com par install ka tareeqa hai) aur login karein.
4. Yeh repo apne computer par clone karein aur us folder mein terminal kholein:
   ```
   git clone <repo-url>
   cd AIW2.0STACK
   claude
   ```
5. Claude Code poochega ke `.mcp.json` wala `linkedin-browser` server use karna hai. **Approve** karein.
6. Check karein: Claude Code mein `/mcp` likhein. `linkedin-browser` "connected" dikhna chahiye.

**Windows note:** agar `/mcp` mein server fail dikhaye, to `.mcp.json` mein `"command": "npx"` ko `"command": "cmd"` karein aur `args` ke shuru mein `"/c", "npx",` daal dein.

## Pehli dafa login

1. Claude Code mein likhein: `linkedin.com/login kholo`
2. Chrome ki ek nayi window khulegi. Us mein **khud** email aur password daal kar login karein (2FA bhi khud).
3. Login is profile mein save ho jata hai. Agli dafa dobara nahi karna padega.

Password kabhi Claude ko chat mein na dein. Apne ghar ya office ke internet se hi yeh chalayein. Cloud server ya VPN se login par LinkedIn verification maang sakta hai.

## Roz ka istemal

```
/linkedin-prospect
```
Claude poochega: kaunsa niche, kaunsi state ya city, kitne prospects (max 25). Phir woh profiles parhega aur file bana dega:

```
research/linkedin/prospects-2026-09-28.md
```

Us file se har prospect ka note copy karein, LinkedIn par khud "Connect" > "Add a note" mein paste karein aur bhejein.

## Hadood (account bachane ke liye)

| Kaam | Limit |
|---|---|
| Connection requests (aap khud) | 15 se 20 per day, ~100 per week |
| Claude ke profile views | 25 per run, din mein 1 se 2 runs |
| Same message sab ko | Kabhi nahi, har note mein ek alag detail |

Agar LinkedIn CAPTCHA, "restricted" ya "security check" dikhaye to Claude ruk jayega. Aap us din LinkedIn par koi automation na chalayein.
