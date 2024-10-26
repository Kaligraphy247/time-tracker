"""Quickly restore incognito browsing session, without the cookies, of course."""

import os, platform, time

restore_sites = [
    "http://localhost:5173",
    "https://www.npmjs.com/package/surrealdb",
    "https://surrealdb.com/docs/sdk/javascript/engines/node",
    "https://surrealdb.com/docs/surrealdb/cli/start",
    "https://surrealdb.com/docs/surrealdb/cli/start"
]

print(f"Running on Platform: {platform.system()}")

if platform.system() == "Darwin":
    for (index, site) in enumerate(restore_sites, 1):
        time.sleep(.5) # slow down a bit.
        print(f'{index}. Restoring "{site}"...')
        os.system(f'open -na "Google Chrome" --args --incognito {site}')



elif platform.system() == "Windows":
    chrome_path = r"C:\Program Files\Google\Chrome\Application"
    os.chdir(chrome_path)

    for (index, site) in enumerate(restore_sites, 1):
        print(f'{index}. Restoring "{site}"...')
        os.system(f"chrome.exe --incognito {site}")


# path of chrome is known
elif platform.system() == "Linux":
	chrome_path = "/opt/google/chrome/"
	os.chdir(chrome_path)
	
	for (index, site) in enumerate(restore_sites, 1):
		print(f'{index}. Restoring "{site}"...')
		os.system(f"./chrome --incognito {site}")
		

print(
    f"\nRestored {len(restore_sites)} {'site' if len(restore_sites) == 1 else 'sites'} from previous session.\nDone."
)
