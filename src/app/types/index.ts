import { File } from '@foal/storage';

export interface LandownerDashboardData {
  totalPropertyCount: string;
  payment: string;
  agreed_amount: string;
  payment_created_at: string;
  tenant_id: number;
}

export interface OnboardingFiles {
  identificationImageFront: File;
  identificationImageBack: File;
  tenantPicture: File;
  agreement: File;
  consentImageFront: File;
  consentImageBack: File;
  kanzuReceipt: File;
  groundRentReceipt: File;
  spouseIDImageFront: File;
  spouseIDImageBack: File;
}
