import { StyleSheet, Text, View } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0B1E',
  },
  keyboardView: {
    flex: 1,
  },
  containerFirst: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  containerMain: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    padding: 20,
    marginTop: 70,
  },
  title: {
    fontSize: 28,
    color: "#ffff",
    fontFamily: "Sansation-Bold",
  },
  normalText: {
    fontSize: 20,
    color: "#ACA8A8",
    fontFamily: "Sansation",
    marginBottom: 50,
    textAlign: "center"
  },
  separator: {
    marginVertical: 8,
    height: 1,
    width: '80%',
    backgroundColor: "#ffffff",
  },
  inputContainer: {
    width: '100%',
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1C209F",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#090C6B",
    marginBottom: 20,
  },
  inputs: {
    flex: 1,
    height: 40,
    color: '#FFFFFF', // Adicionei a cor branca para o texto digitado ser visível
  },
  icon: {
    marginRight: 8,
  },
  loginButtonContainer: {
    backgroundColor: '#425fddff',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: "Sansation-Bold",
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 2,
    marginBottom: 24,
  },
  optionsText: {
    color: '#A0A0A0',
    marginLeft: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    marginVertical: 24,
    alignItems: 'center',
  },
  dividerText: {
    color: '#A0A0A0',
    marginHorizontal: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ffffffff',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    color: '#A0A0A0',
    fontWeight: '700',
  },
  registerLink: {
    color: '#3E66B3',
    fontWeight: 'bold',
  },
});