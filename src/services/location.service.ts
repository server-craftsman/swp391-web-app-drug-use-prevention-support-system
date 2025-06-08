import axios from 'axios';

// Vietnam location API base URL
const API_URL = 'https://provinces.open-api.vn/api';

export interface Province {
    code: string;
    name: string;
    division_type: string;
    codename: string;
    phone_code: number;
}

export interface District {
    code: string;
    name: string;
    division_type: string;
    codename: string;
    province_code: string;
}

export interface Ward {
    code: string;
    name: string;
    division_type: string;
    codename: string;
    district_code: string;
}

export const LocationService = {
    /**
     * Get all provinces in Vietnam
     * @returns Promise with list of provinces
     */
    getProvinces: async (): Promise<Province[]> => {
        try {
            const response = await axios.get(`${API_URL}/p`);
            return response.data;
        } catch (error) {
            console.error('Error fetching provinces:', error);
            return [];
        }
    },

    /**
     * Get all districts in a province
     * @param provinceCode Province code
     * @returns Promise with list of districts
     */
    getDistricts: async (provinceCode: string): Promise<District[]> => {
        try {
            const response = await axios.get(`${API_URL}/p/${provinceCode}?depth=2`);
            return response.data.districts || [];
        } catch (error) {
            console.error('Error fetching districts:', error);
            return [];
        }
    },

    /**
     * Get all wards in a district
     * @param districtCode District code
     * @returns Promise with list of wards
     */
    getWards: async (districtCode: string): Promise<Ward[]> => {
        try {
            const response = await axios.get(`${API_URL}/d/${districtCode}?depth=2`);
            return response.data.wards || [];
        } catch (error) {
            console.error('Error fetching wards:', error);
            return [];
        }
    },

    /**
     * Format full address from selected location components
     * @param addressDetails Street address and other details
     * @param ward Selected ward
     * @param district Selected district
     * @param province Selected province
     * @returns Formatted address string
     */
    formatFullAddress: (
        addressDetails: string,
        ward?: Ward,
        district?: District,
        province?: Province
    ): string => {
        const components = [
            addressDetails,
            ward?.name,
            district?.name,
            province?.name
        ].filter(Boolean);

        return components.join(', ');
    }
}; 