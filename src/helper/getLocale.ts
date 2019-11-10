export const getEnvLocale = (env: any) => {
    env = env || process.env;

    return env.LC_ALL || env.LC_MESSAGES || env.LANG || env.LANGUAGE;
}