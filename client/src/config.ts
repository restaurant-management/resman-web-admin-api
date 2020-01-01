const config = {
    idleTimeout: 5 * 60 * 1000, // Maximum idle time when user don't select remember password.
    rememberPWTime: 24 * 60 * 60 * 1000, // Maximum remember password time.
};

export { config as Config };
