# Maintaining MTN Reports with AWS S3

s3://{bucketName}/reports/mtn/

## Downloading the reports

Url: https://MTNmoney.MTN.co.ug:5937/MTNMoney/

1. Click **Transactions Reports**
2. Select **Customer Transaction Reports**
3. Select the parameters below
   **Start and End Date:** Select 15 day range for report
   **MFS Provider:** MTN
   **Payment Instrument:** Wallet
4. Submit to export CSV file
5. Upload CSV file to public MTN CSV directory

> NOTE: do not rename or edit the files.
> All files are named as _Customer*Transaction_Report*{date_range}.csv_

## Uploading the Reports to AWS Directory

Url: s3://{bucketName}/reports/MTN/

1. Login to AWS Console
2. Select S3 from services
3. Navigate to the url above
4. In the MTN Directory, click **Upload**
5. Select the files from your local machine
6. Submit to complete submission
