// components/kyc/types.ts
export type Step =
    | 'INTRO'
    | 'FORM_INPUT'      // Bước mới: Điền thông tin
    | 'CCCD_FRONT'
    | 'CCCD_BACK'
    | 'LICENSE_FRONT'
    | 'LICENSE_BACK'
    | 'FACE_SCAN'
    | 'PROCESSING'
    | 'SUCCESS';        // Bước mới: Hoàn thành

export type DocumentType = 'cccd' | 'license';

export interface UserInfo {
    fullName: string;
    idNumber: string;
    licenseNumber: string;
    dob: string;
    address: string;
}