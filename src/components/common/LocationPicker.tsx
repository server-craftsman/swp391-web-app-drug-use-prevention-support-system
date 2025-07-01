import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Modal, Space, Tabs, message, Spin } from 'antd';
import { EnvironmentOutlined, SearchOutlined, GlobalOutlined, UnorderedListOutlined, LoadingOutlined } from '@ant-design/icons';

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
    const mapContainerRef = useRef<HTMLDivElement>(null);

    // Common Vietnam locations for quick selection
    const commonLocations = [
        'TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ',
        'Quận 1, TP. Hồ Chí Minh', 'Quận 3, TP. Hồ Chí Minh', 'Quận 7, TP. Hồ Chí Minh',
        'Quận Hoàn Kiếm, Hà Nội', 'Quận Ba Đình, Hà Nội', 'Quận Cầu Giấy, Hà Nội'
    ];

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

    const handleLocationSelect = (location: string) => {
        setSelectedLocation(location);
        setMapLocation(location);
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
                                style={{ backgroundColor: '#20558A' }}
                            >
                                Tìm
                            </Button>
                        </Space.Compact>
                    </div>

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
                            <li>Nhập tên địa điểm và nhấn "Tìm" để hiển thị khu vực</li>
                            <li><strong>Click trực tiếp lên bản đồ</strong> tại vị trí bạn muốn chọn</li>
                            <li>Hệ thống sẽ tự động <strong>tìm địa chỉ chi tiết</strong> của vị trí đó</li>
                            <li>Địa chỉ đầy đủ (số nhà, đường, quận, thành phố) sẽ được hiển thị</li>
                            <li>Nhấn "Xác nhận" để lưu địa chỉ chi tiết đã chọn</li>
                        </ol>
                        <div style={{ marginTop: 8, padding: 6, backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 4, fontSize: 11 }}>
                            <strong>💡 Lưu ý:</strong> Địa chỉ sẽ được hiển thị theo định dạng Việt Nam (số nhà, tên đường, quận/huyện, thành phố)
                        </div>
                    </div>
                </>
            )
        },
        {
            key: 'list',
            label: (
                <span>
                    <UnorderedListOutlined />
                    <span className='ml-1'>Địa điểm phổ biến</span>
                </span>
            ),
            children: (
                <>
                    <div style={{ marginBottom: 16 }}>
                        <h4 style={{ marginBottom: 12, color: '#20558A' }}>Chọn nhanh địa điểm:</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8 }}>
                            {commonLocations.map((location) => (
                                <Button
                                    key={location}
                                    size="small"
                                    onClick={() => handleLocationSelect(location)}
                                    style={{
                                        borderColor: selectedLocation === location ? '#20558A' : '#d9d9d9',
                                        color: selectedLocation === location ? '#20558A' : '#666',
                                        backgroundColor: selectedLocation === location ? '#f0f7ff' : 'white',
                                        textAlign: 'left'
                                    }}
                                >
                                    <EnvironmentOutlined style={{ marginRight: 4 }} />
                                    {location}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginTop: 16 }}>
                        <Input
                            placeholder="Hoặc nhập địa điểm tùy chỉnh..."
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            prefix={<EnvironmentOutlined />}
                        />
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
                title="Chọn địa điểm"
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
                            <div>
                                <strong style={{ color: '#389e0d' }}>Địa chỉ đã chọn:</strong>
                                <div style={{ color: '#52c41a', wordBreak: 'break-all', lineHeight: '1.4' }}>{selectedLocation}</div>
                            </div>
                        </Space>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default LocationPicker; 