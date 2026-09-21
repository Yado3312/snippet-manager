using System.ComponentModel;
using Microsoft.Data.Sqlite; 

namespace backend.Data;


public sealed class DatabaseManager
{
    private static readonly Lazy<DatabaseManager> _instance = new(() => new DatabaseManager());

    private readonly string _connectionString; 

    private DatabaseManager()
    {
        var dbPath = Path.Combine(Directory.GetCurrentDirectory(), "snippest.db");
        _connectionString = $"Data Source={dbPath}"; 
        InitializeSchema();
    }

    public static DatabaseManager Instance => _instance.Value; 


    public SqliteConnection CreateConnection()
    {
        var connection = new SqliteConnection(_connectionString);
        connection.Open();
        return connection;
    }

    private void InitializeSchema()
    {
        using var connection = CreateConnection();
        using var command = connection.CreateCommand();
        command.CommandText = """
            CREATE TABLE IF NOT EXISTS Snippets (
                Id        INTEGER PRIMARY KEY AUTOINCREMENT,
                Title     TEXT NOT NULL,
                Language  TEXT NOT NULL,
                Code      TEXT NOT NULL,
                Tags      TEXT NOT NULL DEFAULT '',
                CreatedAt TEXT NOT NULL
            );
            """;
        command.ExecuteNonQuery();
    }



}