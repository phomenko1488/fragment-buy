import  { useState, useEffect } from 'react';

const UsernameCard = ({ isWalletConnected }) => {
    const [timeLeft, setTimeLeft] = useState(24 * 60 * 60); // 24 часа в секундах

    // Таймер обратного отсчета
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Форматирование времени
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Обработка нажатия кнопки "Принять"
    const handleAccept = () => {
        if (!isWalletConnected) {
            alert('Сначала подключите кошелек!');
            return;
        }
        alert('Транзакция успешно завершена!');
    };

    return (
        <div className="username-card">
            <div className="username">@example</div>
            <div className="price">100 TON</div>
            <div className="timer">Осталось: {formatTime(timeLeft)}</div>
            <button
                className="accept-button"
                onClick={handleAccept}
                disabled={!isWalletConnected || timeLeft === 0}
            >
                Принять
            </button>
        </div>
    );
};

export default UsernameCard;