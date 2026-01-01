# Test Your API Keys in Browser

## Quick Test URL

Copy and paste this into your browser (it uses your keys from .env.local):

```
http://real-estate-store.local/wp-json/wc/v3/products?consumer_key=ck_44538aa3ffd344dcfd973069f353a1dad4f388a8&consumer_secret=cs_8b9c8ef2ac7b3dba8b48f64545e0d44c3e189773
```

## What You Should See

### ✅ If Keys Work:
You'll see JSON data like:
```json
[
  {
    "id": 1,
    "name": "Product Name",
    "price": "19.99",
    ...
  }
]
```

### ❌ If Keys Don't Work:
You'll see an error like:
```json
{
  "code": "woocommerce_rest_cannot_view",
  "message": "Sorry, you cannot list resources."
}
```

## After Changing Store to "Live"

1. **Make sure you clicked "Save changes"** on the Site visibility page
2. **Wait 10 seconds** for WordPress to update
3. **Test the URL above** in your browser
4. If it works in browser, **restart Next.js** and test again

## If Browser Test Works But Next.js Doesn't

1. Clear Next.js cache:
   ```bash
   rm -rf .next
   npm run dev
   ```

2. Or hard refresh browser: Ctrl+Shift+R

