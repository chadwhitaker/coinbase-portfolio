# Coinbase Portfolio



## 1. Deploy the repo

**a) Clone repo**

```
git clone git@github.com:chadwhitaker/coinbase-portfolio.git
```
and then deploy to your server however you prefer.

**b) Deploy directly to Heroku (recommended)**

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/chadwhitaker/coinbase-portfolio)

## 2. Obtain your Coinbase API Keys

Note: Pay close attention to the permissions you set. You'll notice that you will only setup *read access* on your wallet to obtain the wallet's balance.

1. Log in to your Coinbase account and visit the [API Access](https://www.coinbase.com/settings/api) settings.

2. Click "New API Key".

3. Enter your 2-step verification code if required.

4. Select "all" Accounts and "wallet:accounts:read" Permission.

5. Click "Create" and enter your 2-step verification code again if required.

6. Click "Show" for the API Key you just created.

7. Yep! Enter your 2-step verification code again if required :)

8. You now have access to your `API Key` and `API Secret`. Take note for the next step.

## Config your Environment Variables
