from app import create_app

# Cria a instância da aplicação Flask
app = create_app()

if __name__ == '__main__':
    # Roda o servidor de desenvolvimento
    app.run(debug=True)