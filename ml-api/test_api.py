# ============================================
# Script de Teste da API
# ============================================
"""
Testa os endpoints da API de classificação de gênero musical.
"""

import requests
import json
import sys
from typing import Dict, Any

API_BASE_URL = "http://localhost:8000"

def print_section(title: str):
    """Imprime uma seção formatada"""
    print("\n" + "="*60)
    print(f" {title}")
    print("="*60 + "\n")

def test_health():
    """Testa o endpoint de health check"""
    print("🔍 Testando health check...")
    try:
        response = requests.get(f"{API_BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Status: {data['status']}")
            print(f"✅ Modelo carregado: {data['model_loaded']}")
            print(f"✅ Encoder carregado: {data['encoder_loaded']}")
            return True
        else:
            print(f"❌ Erro: Status {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Erro de conexão: {e}")
        print("\n⚠️  Certifique-se de que a API está rodando:")
        print("   python api_model_server.py")
        return False

def test_info():
    """Testa o endpoint de informações do modelo"""
    print("🔍 Testando informações do modelo...")
    try:
        response = requests.get(f"{API_BASE_URL}/info", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Modelo: {data['model']['type']}")
            print(f"✅ Versão: {data['model']['version']}")
            print(f"✅ Acurácia: {data['model']['test_accuracy']:.2%}")
            print(f"✅ Features: {data['features']['count']}")
            print(f"✅ Gêneros: {', '.join(data['genres'])}")
            return True
        else:
            print(f"❌ Erro: Status {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Erro: {e}")
        return False

def test_classify_profile():
    """Testa o endpoint de classificação de perfil"""
    print("🔍 Testando classificação de perfil...")
    
    # Perfil de exemplo (características de música POP)
    test_profile = {
        "danceability": 0.65,
        "energy": 0.70,
        "valence": 0.60,
        "tempo": 120.0,
        "acousticness": 0.25,
        "instrumentalness": 0.05,
        "speechiness": 0.08,
        "loudness": -5.0,
        "key": 5,
        "mode": 1,
        "liveness": 0.15,
        "duration_ms": 210000,
        "track_popularity": 75,
        "release_year": 2023,
        "subgenre_encoded": 0
    }
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/classify_profile",
            json=test_profile,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Gênero previsto: {data['primary_genre'].upper()}")
            print(f"✅ Confiança: {data['confidence']:.2%}")
            print("\n📊 Scores de todos os gêneros:")
            for score in data['all_scores'][:5]:  # Top 5
                print(f"   • {score['genre'].upper()}: {score['confidence']:.1f}%")
            return True
        else:
            print(f"❌ Erro: Status {response.status_code}")
            print(f"   Resposta: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Erro: {e}")
        return False

def test_different_profiles():
    """Testa diferentes perfis musicais"""
    print("🔍 Testando diferentes perfis musicais...\n")
    
    profiles = {
        "POP": {
            "danceability": 0.65, "energy": 0.70, "valence": 0.60,
            "tempo": 120.0, "acousticness": 0.25, "instrumentalness": 0.05,
            "speechiness": 0.08, "loudness": -5.0
        },
        "ROCK": {
            "danceability": 0.50, "energy": 0.85, "valence": 0.50,
            "tempo": 140.0, "acousticness": 0.10, "instrumentalness": 0.30,
            "speechiness": 0.05, "loudness": -3.0
        },
        "RAP": {
            "danceability": 0.70, "energy": 0.60, "valence": 0.45,
            "tempo": 95.0, "acousticness": 0.15, "instrumentalness": 0.00,
            "speechiness": 0.35, "loudness": -4.0
        },
        "CLÁSSICA": {
            "danceability": 0.30, "energy": 0.30, "valence": 0.40,
            "tempo": 80.0, "acousticness": 0.90, "instrumentalness": 0.85,
            "speechiness": 0.03, "loudness": -15.0
        },
    }
    
    results = []
    
    for profile_name, features in profiles.items():
        try:
            response = requests.post(
                f"{API_BASE_URL}/classify_profile",
                json=features,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                predicted = data['primary_genre'].upper()
                confidence = data['confidence']
                
                status = "✅" if predicted.startswith(profile_name.split()[0]) else "⚠️"
                print(f"{status} {profile_name:12} → Previsto: {predicted:6} ({confidence:.0%})")
                results.append(True)
            else:
                print(f"❌ {profile_name:12} → Erro: {response.status_code}")
                results.append(False)
                
        except Exception as e:
            print(f"❌ {profile_name:12} → Erro: {e}")
            results.append(False)
    
    return all(results)

def main():
    """Executa todos os testes"""
    print_section("TESTE DA API DE CLASSIFICAÇÃO MUSICAL")
    
    print("🎯 URL da API:", API_BASE_URL)
    print()
    
    # Lista de testes
    tests = [
        ("Health Check", test_health),
        ("Informações do Modelo", test_info),
        ("Classificação de Perfil", test_classify_profile),
        ("Diferentes Perfis", test_different_profiles),
    ]
    
    results = []
    
    for test_name, test_func in tests:
        print_section(test_name)
        try:
            result = test_func()
            results.append(result)
        except Exception as e:
            print(f"❌ Erro inesperado: {e}")
            results.append(False)
    
    # Sumário
    print_section("SUMÁRIO")
    
    passed = sum(results)
    total = len(results)
    
    print(f"✅ Testes passaram: {passed}/{total}")
    print(f"❌ Testes falharam: {total - passed}/{total}")
    
    if passed == total:
        print("\n🎉 Todos os testes passaram com sucesso!")
        print("✅ A API está funcionando corretamente!")
        return 0
    else:
        print("\n⚠️  Alguns testes falharam.")
        print("   Verifique os logs acima para detalhes.")
        return 1

if __name__ == "__main__":
    try:
        exit_code = main()
        sys.exit(exit_code)
    except KeyboardInterrupt:
        print("\n\n⚠️  Testes interrompidos pelo usuário")
        sys.exit(1)
