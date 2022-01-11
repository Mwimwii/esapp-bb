# Maintaining Airtel Reports with AWS S3

s3://{bucketName}/reports/airtel/

## Downloading the reports

Url: https://airtelmoney.airtel.co.ug:5937/AirtelMoney/

1. Click **Transactions Reports**
2. Select **Customer Transaction Reports**
3. Select the parameters below
   **Start and End Date:** Select 15 day range for report
   **MFS Provider:** Airtel
   **Payment Instrument:** Wallet
4. Submit to export CSV file
5. Upload CSV file to public Airtel CSV directory

> NOTE: do not rename or edit the files.
> All files are named as _Customer*Transaction_Report*{date_range}.csv_

## Uploading the Reports to AWS Directory

Url: s3://{bucketName}/reports/airtel/

1. Login to AWS Console
2. Select S3 from services
3. Navigate to the url above
4. In the Airtel Directory, click **Upload**
5. Select the files from your local machine
6. Submit to complete submission
