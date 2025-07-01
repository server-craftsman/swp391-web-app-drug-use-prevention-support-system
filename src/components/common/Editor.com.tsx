import React, { useState, useRef, useEffect } from 'react';
import { Button, Space, Tooltip, Modal, Input, Upload, Tabs, message } from 'antd';
import type { UploadProps } from 'antd';
import {
    BoldOutlined,
    ItalicOutlined,
    UnderlineOutlined,
    OrderedListOutlined,
    UnorderedListOutlined,
    AlignLeftOutlined,
    AlignCenterOutlined,
    AlignRightOutlined,
    PictureOutlined,
    LinkOutlined,
    CloudUploadOutlined
} from '@ant-design/icons';

interface EditorProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    height?: number;
}

const Editor: React.FC<EditorProps> = ({
    value = '',
    onChange,
    placeholder = "Nhập mô tả...",
    height = 200
}) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [activeImageTab, setActiveImageTab] = useState('url');

    useEffect(() => {
        if (editorRef.current && value !== editorRef.current.innerHTML) {
            editorRef.current.innerHTML = value;
        }
    }, [value]);

    const execCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
        handleContentChange();
    };

    const handleContentChange = () => {
        if (editorRef.current && onChange) {
            const newContent = editorRef.current.innerHTML;
            onChange(newContent);
        }
    };

    const handleInput = () => {
        handleContentChange();
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
        handleContentChange();
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();

        const clipboardData = e.clipboardData;

        // 1. Check if there are image files in clipboard (direct image copy)
        const files = Array.from(clipboardData.files);
        if (files.length > 0) {
            files.forEach(file => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const result = event.target?.result as string;
                        if (result) {
                            insertImageFromBase64(result);
                        }
                    };
                    reader.readAsDataURL(file);
                }
            });
            return;
        }

        // 2. Check for HTML content (rich content from websites/articles)
        const htmlData = clipboardData.getData('text/html');
        if (htmlData) {
            // Create temporary div to parse HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlData;

            // Process and style images
            const images = tempDiv.querySelectorAll('img');
            images.forEach((img) => {
                const originalSrc = img.src;

                // Keep all image sources (data URLs, HTTP URLs)
                if (originalSrc) {
                    img.style.maxWidth = '100%';
                    img.style.height = 'auto';
                    img.style.display = 'block';
                    img.style.margin = '10px 0';
                    img.style.borderRadius = '4px';
                    img.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                    img.alt = img.alt || 'Pasted image';

                    // Add error handling for broken images
                    img.onerror = () => {
                        img.style.border = '2px dashed #ccc';
                        img.style.padding = '20px';
                        img.style.textAlign = 'center';
                        img.alt = '❌ Không thể tải hình ảnh: ' + originalSrc;
                    };
                } else {
                    img.remove();
                }
            });

            // Clean unwanted elements
            const unwantedElements = tempDiv.querySelectorAll('script, style, meta, link, iframe');
            unwantedElements.forEach(el => el.remove());

            // Clean attributes but keep essential ones
            const allElements = tempDiv.querySelectorAll('*');
            allElements.forEach(el => {
                const allowedAttributes = ['src', 'alt', 'href', 'title'];
                const attributes = Array.from(el.attributes);
                attributes.forEach(attr => {
                    if (!allowedAttributes.includes(attr.name)) {
                        el.removeAttribute(attr.name);
                    }
                });

                // Keep styles only for images
                if (el.tagName.toLowerCase() !== 'img') {
                    el.removeAttribute('style');
                }
            });

            // Insert cleaned HTML content
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.deleteContents();

                const fragment = document.createDocumentFragment();
                while (tempDiv.firstChild) {
                    fragment.appendChild(tempDiv.firstChild);
                }
                range.insertNode(fragment);

                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
            } else if (editorRef.current) {
                while (tempDiv.firstChild) {
                    editorRef.current.appendChild(tempDiv.firstChild);
                }
            }

            handleContentChange();
            message.success('Đã dán nội dung với hình ảnh từ web!');
            return;
        }

        // 3. Fallback to plain text
        const text = clipboardData.getData('text/plain');
        if (text) {
            document.execCommand('insertText', false, text);
            handleContentChange();
        }
    };

    const isCommandActive = (command: string): boolean => {
        try {
            return document.queryCommandState(command);
        } catch {
            return false;
        }
    };

    // Handle image insertion from URL
    const insertImageFromUrl = () => {
        if (!imageUrl.trim()) {
            message.error('Vui lòng nhập URL hình ảnh!');
            return;
        }

        // Validate URL format
        try {
            new URL(imageUrl);
        } catch {
            message.error('URL không hợp lệ!');
            return;
        }

        const img = document.createElement('img');
        img.src = imageUrl;
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';
        img.style.margin = '10px 0';
        img.alt = 'Inserted image';

        // Insert image at current cursor position
        if (editorRef.current) {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                range.insertNode(img);

                // Move cursor after image
                range.setStartAfter(img);
                range.setEndAfter(img);
                selection.removeAllRanges();
                selection.addRange(range);
            } else {
                // Fallback: append to end
                editorRef.current.appendChild(img);
            }

            handleContentChange();
            editorRef.current.focus();
        }

        setImageUrl('');
        setIsImageModalOpen(false);
        message.success('Đã chèn hình ảnh từ URL!');
    };

    // Handle file upload
    const handleFileUpload: UploadProps['customRequest'] = (options) => {
        const { file } = options;

        if (file instanceof File) {
            // Convert file to base64 for demo purposes
            // In production, you would upload to a server
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result as string;
                if (result) {
                    insertImageFromBase64(result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Insert image from base64 data
    const insertImageFromBase64 = (base64: string) => {
        const img = document.createElement('img');
        img.src = base64;
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.display = 'block';
        img.style.margin = '10px 0';
        img.alt = 'Uploaded image';

        if (editorRef.current) {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                range.insertNode(img);

                // Move cursor after image
                range.setStartAfter(img);
                range.setEndAfter(img);
                selection.removeAllRanges();
                selection.addRange(range);
            } else {
                editorRef.current.appendChild(img);
            }

            handleContentChange();
            editorRef.current.focus();
        }

        setIsImageModalOpen(false);
        message.success('Đã tải lên và chèn hình ảnh!');
    };

    // Validate image file
    const beforeUpload = (file: File) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('Chỉ được phép tải lên file hình ảnh!');
            return false;
        }

        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error('Hình ảnh phải nhỏ hơn 10MB!');
            return false;
        }

        return true;
    };

    const toolbar = [
        { command: 'bold', icon: <BoldOutlined />, tooltip: 'Đậm' },
        { command: 'italic', icon: <ItalicOutlined />, tooltip: 'Nghiêng' },
        { command: 'underline', icon: <UnderlineOutlined />, tooltip: 'Gạch dưới' },
        { command: 'insertOrderedList', icon: <OrderedListOutlined />, tooltip: 'Danh sách có số' },
        { command: 'insertUnorderedList', icon: <UnorderedListOutlined />, tooltip: 'Danh sách không số' },
        { command: 'justifyLeft', icon: <AlignLeftOutlined />, tooltip: 'Căn trái' },
        { command: 'justifyCenter', icon: <AlignCenterOutlined />, tooltip: 'Căn giữa' },
        { command: 'justifyRight', icon: <AlignRightOutlined />, tooltip: 'Căn phải' },
    ];

    const showPlaceholder = !isFocused && (!value || value.trim() === '' || value === '<br>');

    const imageModalTabs = [
        {
            key: 'url',
            label: (
                <span>
                    <LinkOutlined />
                    <span style={{ marginLeft: 8 }}>URL hình ảnh</span>
                </span>
            ),
            children: (
                <div>
                    <Input
                        placeholder="Nhập URL hình ảnh (ví dụ: https://example.com/image.jpg)"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        onPressEnter={insertImageFromUrl}
                        style={{ marginBottom: 16 }}
                    />
                    <div style={{
                        padding: 12,
                        backgroundColor: '#f0f7ff',
                        border: '1px solid #91d5ff',
                        borderRadius: 6,
                        fontSize: 12,
                        color: '#1890ff'
                    }}>
                        <strong>💡 Hướng dẫn:</strong>
                        <ul style={{ margin: '4px 0 0 16px' }}>
                            <li>Dán URL trực tiếp từ Google Images, Unsplash, v.v.</li>
                            <li>URL phải kết thúc bằng .jpg, .png, .gif, .webp</li>
                            <li>Hình ảnh sẽ tự động điều chỉnh kích thước phù hợp</li>
                        </ul>
                    </div>
                </div>
            )
        },
        {
            key: 'upload',
            label: (
                <span>
                    <CloudUploadOutlined />
                    <span style={{ marginLeft: 8 }}>Tải lên file</span>
                </span>
            ),
            children: (
                <div>
                    <Upload.Dragger
                        accept="image/*"
                        customRequest={handleFileUpload}
                        beforeUpload={beforeUpload}
                        showUploadList={false}
                        style={{ marginBottom: 16 }}
                    >
                        <p className="ant-upload-drag-icon">
                            <PictureOutlined style={{ fontSize: 48, color: '#1890ff' }} />
                        </p>
                        <p className="ant-upload-text">Click hoặc kéo thả file hình ảnh vào đây</p>
                        <p className="ant-upload-hint">
                            Hỗ trợ các định dạng: JPG, PNG, GIF, WebP (tối đa 10MB)
                        </p>
                    </Upload.Dragger>
                    <div style={{
                        padding: 12,
                        backgroundColor: '#fff7e6',
                        border: '1px solid #ffd591',
                        borderRadius: 6,
                        fontSize: 12,
                        color: '#d48806'
                    }}>
                        <strong>⚠️ Lưu ý:</strong>
                        <ul style={{ margin: '4px 0 0 16px' }}>
                            <li>Hình ảnh sẽ được chuyển đổi thành base64 (demo)</li>
                            <li>Trong thực tế, file sẽ được tải lên server</li>
                            <li>Chọn hình ảnh có kích thước phù hợp để tối ưu hiệu năng</li>
                        </ul>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="border border-gray-300 rounded-md">
            <style>{`
        .editor-content:empty:before {
          content: attr(data-placeholder);
          color: #bfbfbf;
          font-style: italic;
        }
        .editor-content:focus {
          outline: none;
        }
        .editor-placeholder {
          position: absolute;
          color: #bfbfbf;
          font-style: italic;
          pointer-events: none;
          padding: 12px;
          top: 41px;
        }
        .editor-content img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 10px 0;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .editor-content img:hover {
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
          cursor: pointer;
        }
      `}</style>

            {/* Toolbar */}
            <div className="border-b border-gray-300 p-2 bg-gray-50">
                <Space wrap>
                    {toolbar.map((tool) => (
                        <Tooltip key={tool.command} title={tool.tooltip}>
                            <Button
                                type={isCommandActive(tool.command) ? 'primary' : 'text'}
                                size="small"
                                icon={tool.icon}
                                onClick={() => execCommand(tool.command)}
                            />
                        </Tooltip>
                    ))}

                    {/* Image Button */}
                    <Tooltip title="Chèn hình ảnh">
                        <Button
                            type="text"
                            size="small"
                            icon={<PictureOutlined />}
                            onClick={() => setIsImageModalOpen(true)}
                        />
                    </Tooltip>
                </Space>
            </div>

            {/* Editor Container */}
            <div style={{ position: 'relative' }}>
                {showPlaceholder && (
                    <div className="editor-placeholder">
                        {placeholder}
                    </div>
                )}

                {/* Editor Content */}
                <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handleInput}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onPaste={handlePaste}
                    className="editor-content p-3 outline-none min-h-[200px] max-h-[400px] overflow-y-auto"
                    style={{
                        height: height,
                        fontSize: '14px',
                        lineHeight: '1.5'
                    }}
                />
            </div>

            {/* Image Modal */}
            <Modal
                title="Chèn hình ảnh"
                open={isImageModalOpen}
                onCancel={() => {
                    setIsImageModalOpen(false);
                    setImageUrl('');
                }}
                footer={activeImageTab === 'url' ? [
                    <Button key="cancel" onClick={() => {
                        setIsImageModalOpen(false);
                        setImageUrl('');
                    }}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={insertImageFromUrl}>
                        Chèn hình ảnh
                    </Button>
                ] : null}
                width={600}
            >
                <Tabs
                    activeKey={activeImageTab}
                    onChange={setActiveImageTab}
                    items={imageModalTabs}
                />
            </Modal>
        </div>
    );
};

export default Editor;
