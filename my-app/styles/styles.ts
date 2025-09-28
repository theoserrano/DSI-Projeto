import { StyleSheet, Text, View } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4F3F8',
  },
  keyboardView: {
    flex: 1,
  },
  containerFirst: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  containerMain: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    padding: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    color: "#0A0F6D",
    fontFamily: "SansationBold",
  },
  normalText: {
    fontSize: 20,
    color: "#292828ff",
    fontFamily: "Sansation",
    marginBottom: 20,
    textAlign: "center"
  },
  separator: {
    marginVertical: 4,
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
    color: "#6977BD"
  },
  loginButtonContainer: {
    backgroundColor: '#0A0F6D',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: "SansationBold",
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
    color: '#292828ff',
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
    color: '#292828ff',
    fontWeight: '700',
  },
  registerLink: {
    color: '#3E66B3',
    fontWeight: 'bold',
  },
});