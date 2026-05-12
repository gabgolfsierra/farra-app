import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { useState } from 'react'
import { useFonts, Syne_800ExtraBold, Syne_700Bold, Syne_400Regular } from '@expo-google-fonts/syne'
import { colors } from '../theme/colors'
import { FontAwesome } from '@expo/vector-icons'
import * as WebBrowser from 'expo-web-browser'
import { makeRedirectUri } from 'expo-auth-session'
import { supabase } from '../lib/supabase'

WebBrowser.maybeCompleteAuthSession()

export default function LoginScreen() {
    const [loading, setLoading] = useState(false)

    const [fontsLoaded] = useFonts({
        Syne_800ExtraBold,
        Syne_700Bold,
        Syne_400Regular,
    })

    if (!fontsLoaded) return null

    async function handleGoogleLogin() {
        try {
            setLoading(true)
            const redirectUrl = makeRedirectUri({ scheme: 'farra' })

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: redirectUrl,
                    skipBrowserRedirect: true,
                },
            })

            if (error) throw error

            const result = await WebBrowser.openAuthSessionAsync(
                data.url,
                redirectUrl
            )

            if (result.type === 'success') {
                const url = new URL(result.url)
                const code = url.searchParams.get('code')
                if (code) {
                    await supabase.auth.exchangeCodeForSession(code)
                }
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    async function handleAppleLogin() {
        // fase 2
    }

    return (
        <View style={styles.container}>

            <View style={styles.hero}>
                <View style={styles.dots}>
                    <View style={[styles.dot, { backgroundColor: colors.accent.default }]} />
                    <View style={[styles.dot, { backgroundColor: colors.accent.default, opacity: 0.4 }]} />
                    <View style={[styles.dot, { backgroundColor: colors.accent.default, opacity: 0.2 }]} />
                </View>
                <Text style={styles.logo}>farra</Text>
                <Text style={styles.tagline}>
                    Descubra o que está acontecendo perto de você, agora.
                </Text>
            </View>

            <View style={styles.buttons}>

                <TouchableOpacity
                    style={styles.googleButton}
                    onPress={handleGoogleLogin}
                    disabled={loading}
                    activeOpacity={0.7}
                >
                    <FontAwesome name="google" size={20} color="#DB4437" />
                    <Text style={styles.googleButtonText}>Entrar com Google</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.appleButton}
                    onPress={handleAppleLogin}
                    disabled={loading}
                    activeOpacity={0.7}
                >
                    <FontAwesome name="apple" size={20} color={colors.text.primary} />
                    <Text style={styles.appleButtonText}>Entrar com Apple</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.emailButton}
                    disabled={loading}
                    activeOpacity={0.7}
                >
                    <FontAwesome name="at" size={18} color="#0a0a0a" />
                    <Text style={styles.emailButtonText}>Continuar com e-mail</Text>
                </TouchableOpacity>

                {loading && (
                    <ActivityIndicator
                        color={colors.accent.default}
                        style={{ marginTop: 16 }}
                    />
                )}

            </View>

            <Text style={styles.terms}>
                Ao continuar você aceita os{'\n'}
                <Text style={styles.termsLink}>Termos de Uso</Text>
                {' '}e{' '}
                <Text style={styles.termsLink}>Política de Privacidade</Text>
            </Text>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg.primary,
        paddingHorizontal: 32,
        paddingTop: 80,
        paddingBottom: 48,
        justifyContent: 'space-between',
    },
    dots: {
        flexDirection: 'row',
        gap: 6,
        marginBottom: 32,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    hero: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 48,
    },
    logo: {
        fontFamily: 'Syne_800ExtraBold',
        fontSize: 72,
        color: colors.text.primary,
        lineHeight: 72,
        letterSpacing: -2,
        marginBottom: 16,
    },
    tagline: {
        fontFamily: 'Syne_400Regular',
        fontSize: 15,
        color: colors.text.muted,
        lineHeight: 22,
        maxWidth: 240,
    },
    buttons: {
        gap: 10,
        marginBottom: 32,
    },
    googleButton: {
        backgroundColor: colors.bg.card,
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        borderWidth: 1,
        borderColor: colors.bg.elevated,
    },
    socialIcon: {
        fontSize: 18,
        color: colors.text.primary,
        width: 20,
        textAlign: 'center',
        fontFamily: 'Syne_700Bold',
    },
    googleButtonText: {
        fontFamily: 'Syne_700Bold',
        fontSize: 15,
        color: colors.text.primary,
    },
    appleButton: {
        backgroundColor: colors.bg.card,
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    appleIcon: {
        fontSize: 18,
        color: colors.text.primary,
        width: 20,
        textAlign: 'center',
    },
    appleButtonText: {
        fontFamily: 'Syne_700Bold',
        fontSize: 15,
        color: colors.text.primary,
    },
    emailButton: {
        backgroundColor: colors.accent.default,
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        borderWidth: 1,
        borderColor: colors.bg.elevated,
    },
    emailButtonText: {
        fontFamily: 'Syne_700Bold',
        fontSize: 15,
        color: colors.text.primary,
    },
    terms: {
        fontFamily: 'Syne_400Regular',
        fontSize: 11,
        color: colors.text.muted,
        textAlign: 'center',
        lineHeight: 18,
    },
    termsLink: {
        color: colors.text.secondary,
    },
})