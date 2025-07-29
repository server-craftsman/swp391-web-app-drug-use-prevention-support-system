import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Modal, Space, Tabs, message, Spin } from 'antd';
import { EnvironmentOutlined, SearchOutlined, GlobalOutlined, LoadingOutlined, AimOutlined } from '@ant-design/icons';

interface LocationPickerProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
    value,
    onChange,
    placeholder = "Chọn địa điểm..."
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<string>(value || '');
    const [mapLocation, setMapLocation] = useState<string>('');
    const [activeTab, setActiveTab] = useState<string>('map');
    const [clickedCoords, setClickedCoords] = useState<{ lat: number, lng: number } | null>(null);
    const [isGeocodingLoading, setIsGeocodingLoading] = useState(false);
    const [isGPSLoading, setIsGPSLoading] = useState(false);
    const [currentGPSLocation, setCurrentGPSLocation] = useState<{ lat: number, lng: number } | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);

    // Check if GPS is available
    const isGPSAvailable = () => {
        return navigator.geolocation && navigator.geolocation.getCurrentPosition;
    };

    // Get current GPS location
    const getCurrentLocation = (): Promise<{ lat: number, lng: number }> => {
        return new Promise((resolve, reject) => {
            if (!isGPSAvailable()) {
                reject(new Error('Trình duyệt không hỗ trợ GPS'));
                return;
            }

            const options = {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            };

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    resolve({ lat: latitude, lng: longitude });
                },
                (error) => {
                    let errorMessage = 'Không thể lấy vị trí hiện tại';
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Bạn cần cấp quyền truy cập vị trí để sử dụng tính năng này. Vui lòng kiểm tra cài đặt trình duyệt.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Thông tin vị trí không khả dụng. Vui lòng thử lại sau.';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'Hết thời gian lấy vị trí. Vui lòng thử lại.';
                            break;
                    }
                    reject(new Error(errorMessage));
                },
                options
            );
        });
    };

    // Handle getting current location
    const handleGetCurrentLocation = async () => {
        setIsGPSLoading(true);
        try {
            const coords = await getCurrentLocation();
            setCurrentGPSLocation(coords);

            // Get address from coordinates
            const address = await reverseGeocode(coords.lat, coords.lng);
            setSelectedLocation(address);
            setMapLocation(address);

            // Switch to map tab to show the location
            setActiveTab('map');

            message.success('Đã lấy vị trí hiện tại thành công!');
        } catch (error: any) {
            message.error(error.message || 'Không thể lấy vị trí hiện tại');
        } finally {
            setIsGPSLoading(false);
        }
    };

    // Reverse geocoding function to get address from coordinates
    const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
        setIsGeocodingLoading(true);
        try {
            // Using free Nominatim service for reverse geocoding
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=vi`
            );

            if (response.ok) {
                const data = await response.json();
                if (data && data.display_name) {
                    // Try to get a more formatted address
                    const address = data.address;
                    let formattedAddress = '';

                    if (address) {
                        // Build Vietnamese style address
                        const parts = [];

                        // House number and road
                        if (address.house_number && address.road) {
                            parts.push(`${address.house_number} ${address.road}`);
                        } else if (address.road) {
                            parts.push(address.road);
                        }

                        // Suburb, quarter, or neighbourhood
                        if (address.suburb) {
                            parts.push(address.suburb);
                        } else if (address.quarter) {
                            parts.push(address.quarter);
                        } else if (address.neighbourhood) {
                            parts.push(address.neighbourhood);
                        }

                        // District/City district
                        if (address.city_district) {
                            parts.push(address.city_district);
                        } else if (address.county) {
                            parts.push(address.county);
                        }

                        // City/State
                        if (address.city) {
                            parts.push(address.city);
                        } else if (address.state) {
                            parts.push(address.state);
                        }

                        // Country
                        if (address.country && address.country === 'Việt Nam') {
                            parts.push('Việt Nam');
                        }

                        formattedAddress = parts.join(', ');
                    }

                    // Fallback to display_name if formatted address is empty
                    const finalAddress = formattedAddress || data.display_name;
                    setIsGeocodingLoading(false);
                    return finalAddress;
                }
            }

            // Fallback if geocoding fails
            setIsGeocodingLoading(false);
            return `Vị trí: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;

        } catch (error) {
            console.error('Reverse geocoding failed:', error);
            setIsGeocodingLoading(false);
            return `Vị trí: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        }
    };

    const handleOk = () => {
        if (onChange && selectedLocation) {
            onChange(selectedLocation);
        }
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setSelectedLocation(value || '');
        setMapLocation('');
        setClickedCoords(null);
        setIsModalOpen(false);
    };

    const handleModalOpen = () => {
        setSelectedLocation(value || '');
        setMapLocation(value || '');
        setClickedCoords(null);
        setIsModalOpen(true);
    };

    const handleMapLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const location = e.target.value;
        setMapLocation(location);
    };

    // Search location and update map
    const searchLocation = (query: string) => {
        if (!query.trim()) return;
        setMapLocation(query);
    };

    // Handle map iframe load and setup click detection
    useEffect(() => {
        if (isModalOpen && activeTab === 'map') {
            // Setup map click detection using a simple overlay approach
            const setupMapClickDetection = () => {
                const mapContainer = mapContainerRef.current;
                if (!mapContainer) return;

                // Create an invisible overlay for click detection
                const overlay = document.createElement('div');
                overlay.style.position = 'absolute';
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.width = '100%';
                overlay.style.height = '100%';
                overlay.style.zIndex = '10';
                overlay.style.cursor = 'crosshair';
                overlay.style.backgroundColor = 'transparent';

                overlay.addEventListener('click', async (e) => {
                    const rect = overlay.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    // Calculate approximate coordinates based on click position
                    // This is a simple approximation for the visible map area
                    const mapWidth = rect.width;
                    const mapHeight = rect.height;

                    // Base coordinates for the current map center (default Ho Chi Minh City)
                    const baseLat = 10.8231;
                    const baseLng = 106.6297;

                    // Calculate approximate lat/lng based on click position
                    // Adjust range based on zoom level (zoom 15 shows roughly 0.02 degrees)
                    const latRange = 0.02; // Approximate range visible on map at zoom 15
                    const lngRange = 0.02;

                    const clickLat = baseLat + ((mapHeight / 2 - y) / mapHeight) * latRange;
                    const clickLng = baseLng + ((x - mapWidth / 2) / mapWidth) * lngRange;

                    setClickedCoords({ lat: clickLat, lng: clickLng });

                    // Get detailed address from coordinates
                    message.loading('Đang tìm địa chỉ...', 0.5);
                    const detailedAddress = await reverseGeocode(clickLat, clickLng);
                    setSelectedLocation(detailedAddress);

                    message.success('Đã chọn địa điểm và lấy địa chỉ chi tiết!');
                });

                mapContainer.style.position = 'relative';
                mapContainer.appendChild(overlay);

                return () => {
                    if (mapContainer.contains(overlay)) {
                        mapContainer.removeChild(overlay);
                    }
                };
            };

            const timer = setTimeout(setupMapClickDetection, 1000);
            return () => clearTimeout(timer);
        }
    }, [isModalOpen, activeTab, mapLocation]);

    // Auto get current location when modal opens
    useEffect(() => {
        if (isModalOpen && !value) {
            // Auto get current location after a short delay
            const timer = setTimeout(() => {
                handleGetCurrentLocation();
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [isModalOpen]);

    const tabItems = [
        {
            key: 'map',
            label: (
                <span>
                    <GlobalOutlined />
                    <span className='ml-1'>Bản đồ</span>
                </span>
            ),
            children: (
                <>
                    <div style={{ marginBottom: 16 }}>
                        <Space.Compact style={{ width: '100%' }}>
                            <Input
                                placeholder="Nhập địa điểm để hiển thị trên bản đồ..."
                                value={mapLocation}
                                onChange={handleMapLocationChange}
                                prefix={<SearchOutlined />}
                                size="large"
                                onPressEnter={() => searchLocation(mapLocation)}
                            />
                            <Button
                                type="primary"
                                onClick={() => searchLocation(mapLocation)}
                                // style={{ backgroundColor: '#20558A' }}
                                className='bg-primary p-5'
                            >
                                Tìm
                            </Button>
                            <Button
                                type="default"
                                icon={<AimOutlined />}
                                onClick={handleGetCurrentLocation}
                                loading={isGPSLoading}
                                title="Lấy vị trí hiện tại"
                                size="large"
                                disabled={!isGPSAvailable()}
                            >
                                Vị trí hiện tại
                            </Button>
                        </Space.Compact>
                    </div>

                    {/* GPS Location Info */}
                    {currentGPSLocation && (
                        <div style={{
                            marginBottom: 16,
                            padding: 12,
                            backgroundColor: '#e6f7ff',
                            border: '1px solid #91d5ff',
                            borderRadius: 6,
                            fontSize: 12
                        }}>
                            <Space>
                                <AimOutlined style={{ color: '#1890ff' }} />
                                <div>
                                    <strong style={{ color: '#1890ff' }}>Vị trí GPS hiện tại:</strong>
                                    <div style={{ color: '#52c41a', fontFamily: 'monospace' }}>
                                        {currentGPSLocation.lat.toFixed(6)}, {currentGPSLocation.lng.toFixed(6)}
                                    </div>
                                </div>
                            </Space>
                        </div>
                    )}

                    {/* GPS Not Available Warning */}
                    {!isGPSAvailable() && (
                        <div style={{
                            marginBottom: 16,
                            padding: 12,
                            backgroundColor: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: 6,
                            fontSize: 12,
                            color: '#dc2626'
                        }}>
                            <Space>
                                <AimOutlined style={{ color: '#dc2626' }} />
                                <div>
                                    <strong>⚠️ GPS không khả dụng:</strong>
                                    <div>Trình duyệt của bạn không hỗ trợ GPS hoặc không có quyền truy cập vị trí.</div>
                                </div>
                            </Space>
                        </div>
                    )}

                    <div
                        ref={mapContainerRef}
                        style={{
                            marginBottom: 16,
                            border: '1px solid #d9d9d9',
                            borderRadius: 6,
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {mapLocation ? (
                            <>
                                <iframe
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(mapLocation)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                    width="100%"
                                    height="400"
                                    style={{ border: 0, borderRadius: 6, display: 'block' }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: 10,
                                        left: 10,
                                        backgroundColor: 'rgba(32, 85, 138, 0.9)',
                                        color: 'white',
                                        padding: '8px 12px',
                                        borderRadius: 4,
                                        fontSize: 12,
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                        zIndex: 5
                                    }}
                                >
                                    🎯 Click trên bản đồ để chọn địa chỉ
                                </div>
                                {isGeocodingLoading && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: 10,
                                            right: 10,
                                            backgroundColor: 'rgba(24, 144, 255, 0.9)',
                                            color: 'white',
                                            padding: '8px 12px',
                                            borderRadius: 4,
                                            fontSize: 12,
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                            zIndex: 5
                                        }}
                                    >
                                        <Spin indicator={<LoadingOutlined style={{ fontSize: 12, color: 'white' }} spin />} />
                                        <span style={{ marginLeft: 8 }}>Đang lấy địa chỉ...</span>
                                    </div>
                                )}
                                {clickedCoords && !isGeocodingLoading && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: 10,
                                            right: 10,
                                            backgroundColor: 'rgba(82, 196, 26, 0.9)',
                                            color: 'white',
                                            padding: '8px 12px',
                                            borderRadius: 4,
                                            fontSize: 12,
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                            zIndex: 5,
                                            maxWidth: '200px'
                                        }}
                                    >
                                        ✓ Đã lấy địa chỉ chi tiết
                                    </div>
                                )}
                            </>
                        ) : (
                            <div style={{
                                height: '400px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#f5f5f5',
                                borderRadius: 6,
                                color: '#999'
                            }}>
                                <EnvironmentOutlined style={{ fontSize: 48, marginBottom: 16, color: '#d9d9d9' }} />
                                <div>Nhập địa điểm để xem bản đồ</div>
                                <div style={{ fontSize: 11, marginTop: 4 }}>Sau đó click trên bản đồ để lấy địa chỉ chi tiết</div>
                            </div>
                        )}
                    </div>

                    <div style={{
                        padding: 12,
                        backgroundColor: '#fff7e6',
                        border: '1px solid #ffd591',
                        borderRadius: 6,
                        fontSize: 12,
                        color: '#d48806'
                    }}>
                        <strong>🎯 Hướng dẫn lấy địa chỉ chi tiết:</strong>
                        <ol style={{ margin: '8px 0 0 16px', lineHeight: '1.6' }}>
                            <li><strong>GPS:</strong> Nhấn "Vị trí hiện tại" để tự động lấy địa chỉ từ GPS và hiển thị trên bản đồ</li>
                            <li><strong>Tìm kiếm:</strong> Nhập tên địa điểm và nhấn "Tìm" để hiển thị khu vực</li>
                            <li><strong>Click trên bản đồ:</strong> Click trực tiếp lên bản đồ tại vị trí bạn muốn chọn</li>
                            <li>Hệ thống sẽ tự động <strong>tìm địa chỉ chi tiết</strong> của vị trí đó</li>
                            <li>Địa chỉ đầy đủ (số nhà, đường, quận, thành phố) sẽ được hiển thị</li>
                            <li>Nhấn "Xác nhận" để lưu địa chỉ chi tiết đã chọn</li>
                        </ol>
                        <div style={{ marginTop: 8, padding: 6, backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 4, fontSize: 11 }}>
                            <strong>💡 Lưu ý:</strong>
                            <ul style={{ margin: '4px 0 0 16px', lineHeight: '1.4' }}>
                                <li>Địa chỉ sẽ được hiển thị theo định dạng Việt Nam (số nhà, tên đường, quận/huyện, thành phố)</li>
                                <li>GPS sẽ tự động lấy vị trí hiện tại khi mở modal lần đầu</li>
                                <li>Cần cấp quyền truy cập vị trí cho trình duyệt để sử dụng GPS</li>
                                <li>Khi bấm "Vị trí hiện tại", bản đồ sẽ tự động hiển thị vị trí GPS</li>
                            </ul>
                        </div>
                    </div>
                </>
            )
        }
    ];

    return (
        <>
            <Input
                value={value}
                placeholder={placeholder}
                readOnly
                suffix={
                    <Button
                        type="text"
                        icon={<EnvironmentOutlined />}
                        onClick={handleModalOpen}
                    />
                }
                onClick={handleModalOpen}
                style={{ cursor: 'pointer' }}
            />

            <Modal
                title="Chọn địa điểm trên bản đồ"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={800}
                okText="Xác nhận"
                cancelText="Hủy"
                okButtonProps={{ disabled: !selectedLocation }}
            >
                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={tabItems}
                />

                {selectedLocation && (
                    <div style={{
                        marginTop: 16,
                        padding: 12,
                        background: '#f6ffed',
                        border: '1px solid #b7eb8f',
                        borderRadius: 6
                    }}>
                        <Space>
                            <EnvironmentOutlined style={{ color: '#52c41a' }} />
                            <div style={{ flex: 1 }}>
                                <strong style={{ color: '#389e0d' }}>Địa chỉ đã chọn:</strong>
                                <div style={{ color: '#52c41a', wordBreak: 'break-all', lineHeight: '1.4' }}>{selectedLocation}</div>
                                {currentGPSLocation && (
                                    <div style={{
                                        marginTop: 4,
                                        fontSize: 11,
                                        color: '#1890ff',
                                        fontFamily: 'monospace'
                                    }}>
                                        📍 GPS: {currentGPSLocation.lat.toFixed(6)}, {currentGPSLocation.lng.toFixed(6)}
                                    </div>
                                )}
                            </div>
                        </Space>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default LocationPicker; 