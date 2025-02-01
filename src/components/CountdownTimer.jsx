import React from 'react';
import PropTypes from 'prop-types';
import Countdown from 'react-countdown';
import '../CountdownTimer.css';

const CountdownTimer = ({ seconds }) => {
    // Calculate the target date based on the seconds prop
    const targetDate = Date.now() + seconds * 1000;

    const renderer = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
            return <div>Offer expired</div>;
        }

        // Function to split numbers into individual digits
        const splitNumber = (num) => {
            return String(num).padStart(2, '0').split('');
        };

        const [h1, h2] = splitNumber(hours);
        const [m1, m2] = splitNumber(minutes);
        const [s1, s2] = splitNumber(seconds);

        return (
            <div style={styles.timerContainer} className="align-items-center">
                <div style={styles.timeSection}>
                    <div style={styles.digits}>
                        <span className="left-num" style={styles.digitBlock}>{h1}</span>
                        <span className="right-num" style={styles.digitBlock}>{h2}</span>
                    </div>
                </div>
                <div className="text-white">:</div>
                <div style={styles.timeSection}>
                    <div style={styles.digits}>
                        <span className="left-num" style={styles.digitBlock}>{m1}</span>
                        <span className="right-num" style={styles.digitBlock}>{m2}</span>
                    </div>
                </div>
                <div className="text-white">:</div>
                <div style={styles.timeSection}>
                    <div style={styles.digits}>
                        <span className="left-num" style={styles.digitBlock}>{s1}</span>
                        <span className="right-num animated" style={styles.digitBlock}>{s2}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <Countdown date={targetDate} renderer={renderer} />
        </div>
    );
};

CountdownTimer.propTypes = {
    seconds: PropTypes.number.isRequired,
};

const styles = {
    container: {
        backgroundColor: '#000',
        minHeight: '100vh',
        padding: '2rem',
        fontFamily: 'monospace',
    },
    header: {
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#141414',
        borderRadius: '12px',
        padding: '2rem',
    },
    title: {
        color: '#00b2ff',
        textAlign: 'center',
        marginBottom: '2rem',
    },
    timerContainer: {
        display: 'flex',
        justifyContent: 'space-around',
        gap: '0.1rem',
    },
    timeSection: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    timeLabel: {
        color: '#888',
        fontSize: '0.9rem',
        marginBottom: '0.5rem',
    },
    digits: {
        display: 'flex',
        gap: '0.1rem',
    },
    digitBlock: {
        backgroundColor: '#293440',
        color: '#fff',
        padding: '0.5rem 0.5rem',
        fontWeight: '600',
        textAlign: 'center',
    },
    offerLabel: {
        color: '#888',
        fontSize: '1rem',
        marginBottom: '1rem',
        display: 'block',
        textAlign: 'center',
    },
};

export default CountdownTimer;