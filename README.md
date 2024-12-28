# Chatify Server

## Generate JWT Secret

```bash
openssl rand -base64 32

# or

node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
