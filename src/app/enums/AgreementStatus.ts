export enum AgreementStatus {
    identified = 'Identified',
    contacted = 'Been Contacted',
    contactedfail = 'Been Contacted, No Answer',
    negplanned = 'Planned Negotiation',
    negperformed = 'Performed Negotiation',
    negmissingdocs = 'Missing Documentation',
    negready = 'Ready For Owner Review',
    negagreed = 'Agreed With Owner',
    active = 'Active',
    expired = 'Expired',
    conflicted = 'Conflicted',
    breached = 'Breached',
    fake = 'Fake'
}