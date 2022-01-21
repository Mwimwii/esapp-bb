import { ContactDetailType } from '@titl-all/shared/dist/enum';

export function mapJotformContactDetailPhoneType(isWhatsApp: string): ContactDetailType {
    return isWhatsApp == 'yes' ? ContactDetailType.whatsapp : ContactDetailType.phone;
}
