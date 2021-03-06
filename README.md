# Coinbase Portfolio
A NodeJS application to view your Coinbase Portfolio from the [Numbar app](https://numbarapp.com). This is an excellent way to carefully watch your Coinbase Portfolio directly from the macOS menu bar.

## Install
Installation is easy. Either deploy directly to Heroku or clone the repo and deploy using your preferred method and service.

### 1. Obtain your Coinbase API Keys

Note: Pay close attention to the permissions you set. You'll notice that you will only setup *read access* for your wallets' balance.

1. Log in to your Coinbase account and visit the [API Access](https://www.coinbase.com/settings/api) settings.

2. Click "New API Key".

3. Enter your 2-step verification code if required.

4. Select "all" Accounts and the "wallet:accounts:read" Permission, then click "Create".

  ![Configure your API Key](http://i.imgur.com/a6xrRJl.png)

5. You now have access to your `API Key` and `API Secret`. Take note of these values for the next steps.


### 2. Deploy the repo

**Option A) Deploy directly to Heroku (recommended)**

After you click the "Deploy to Heroku" button below, head to Step 3 to instantly configure your app.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/chadwhitaker/coinbase-portfolio/releases/latest)  

**Option B) Clone repo (optional)**

Or you can clone the repo and then deploy however you prefer.
```
git clone git@github.com:chadwhitaker/coinbase-portfolio.git
```

### 3. Config your Environment Variables

If you used the "Deploy to Heroku" button, you should now see the "Config Variables" section. If you deployed this app using your own method, you would have to configure the environment variables yourself.

  - `HOST` — This is required by Heroku. Make sure it is set to `0.0.0.0`.
  - `COINBASE_API_KEY` — This is the API Key you created in Step 1.
  - `COINBASE_API_SECRET` — This is the API Secret you created in Step 1.
  - `CLIENT_AUTH_KEY` — Create a password to securely access your portfolio from Numbar. It's best if this value is a set of [32+ random characters](http://www.sethcardoza.com/tools/random-password-generator/).  

### 4. Insert your Endpoint URL in your Numbar preferences

Your Endpoint URL will be something like `https://<your-app-id>.herokuapp.com/portfolio`. Insert this URL as the "Endpoint URL" in your Numbar preferences.

Numbar will automatically prompt you for your secure password:
  - Username: `<the CLIENT_AUTH_KEY you created on Step 3>`
  - Password: `<leave blank>`

## Contribution

Pull requests are welcome! If you want to do something big, please open an issue first.

## License
MIT
