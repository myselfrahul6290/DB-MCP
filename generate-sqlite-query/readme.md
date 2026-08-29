 ## use llm
```bash
curl --location 'http://localhost:3000/chat' \
--header 'Content-Type: application/json' \
--data '{
    "message": "customers last invoice history whose name Helena?"
}'
```

## response
```
{
    "sql": "SELECT * FROM invoices WHERE CustomerId = (SELECT CustomerId FROM customers WHERE FirstName = 'Helena') ORDER BY InvoiceDate DESC LIMIT 1",
    "res": [
        {
            "InvoiceId": 404,
            "CustomerId": 6,
            "InvoiceDate": "2013-11-13 00:00:00",
            "BillingAddress": "Rilská 3174/6",
            "BillingCity": "Prague",
            "BillingState": null,
            "BillingCountry": "Czech Republic",
            "BillingPostalCode": "14300",
            "Total": 25.86
        }
    ]
}

```

## using hugging face model "Xenova/t5-small-awesome-text-to-sql"
```
The complex querry excution it fails, but in simple queries work good like, 
Q, customers from Brazil
```

```
{
    "sql": "SELECT Company, COUNT(*) FROM customers WHERE Country = 'Brazil'",
    "res": [
        {
            "Company": "Embraer - Empresa Brasileira de Aeronáutica S.A.",
            "COUNT(*)": 5
        }
    ],
    "flag": 1
}
```
