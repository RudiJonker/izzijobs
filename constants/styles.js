import theme from './theme';

export const styles = {
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    alignSelf: 'center',
    marginTop: -60,
  },
  title: {
    fontSize: theme.sizes.large,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  tagline: {
    color: theme.colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
    backgroundColor: theme.colors.primary,
    borderRadius: 50,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: theme.colors.text,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  radioCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  radioSelected: {
    backgroundColor: theme.colors.primary,
  },
  link: {
    color: theme.colors.accent,
    marginTop: 20,
    marginBottom: 10,
    textDecorationLine: 'underline',
  },
  input: {
    width: '95%',
    height: 40,
    margin: 10,
    padding: 5,
    borderWidth: 1,        // Added border
    borderColor: theme.colors.text, // Matches theme text color
    borderRadius: 4,       // Slight rounding for a clean look
  },
};