export function convertToKebabCase(input: string) {
    const withoutAppPrefix = input.replace(/^App/, '')
    return withoutAppPrefix.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}
