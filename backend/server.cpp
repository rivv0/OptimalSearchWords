#define ASIO_STANDALONE
#include "crow_all.h"
#include "trie.h"
#include <string>
#include <sstream>

struct CORS {
    struct context {};

    void before_handle(crow::request&, crow::response& res, context&) {
        res.add_header("Access-Control-Allow-Origin", "*");
        res.add_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE, PUT");
        res.add_header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.add_header("Content-Type", "application/json");
    }

    void after_handle(crow::request&, crow::response&, context&) {
    }
};

int main() {
    crow::App<CORS> app;
    Trie trie;

    CROW_ROUTE(app, "/<path>")
        .methods("OPTIONS"_method)([](const crow::request&, const std::string&){
            crow::response res;
            res.add_header("Access-Control-Allow-Origin", "*");
            res.add_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE, PUT");
            res.add_header("Access-Control-Allow-Headers", "Content-Type, Authorization");
            res.code = 204;
            return res;
        });

    CROW_ROUTE(app, "/insert/<string>")
    ([&trie](const std::string& word){
        crow::response res;
        res.add_header("Access-Control-Allow-Origin", "*");
        res.add_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE, PUT");
        res.add_header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.add_header("Content-Type", "application/json");
        
        try {
            if (word.empty()) {
                res.code = 400;
                res.body = R"({"error": "Word cannot be empty"})";
                return res;
            }
            trie.insert(word);
            res.code = 200;
            res.body = R"({"success": true, "message": "Word inserted", "word": ")" + word + R"("})";
            return res;
        } catch (const std::exception& e) {
            res.code = 500;
            res.body = R"({"error": "Internal server error"})";
            return res;
        }
    });

    CROW_ROUTE(app, "/search/<string>")
    ([&trie](const std::string& prefix){
        crow::response res;
        res.add_header("Access-Control-Allow-Origin", "*");
        res.add_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE, PUT");
        res.add_header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.add_header("Content-Type", "application/json");
        
        try {
            if (prefix.empty()) {
                res.code = 400;
                res.body = R"({"error": "Search prefix cannot be empty"})";
                return res;
            }
            
            auto results = trie.autocomplete(prefix);
            std::ostringstream json;
            json << R"({"prefix": ")" << prefix << R"(", "suggestions": [)";
            
            for (size_t i = 0; i < results.size() && i < 10; ++i) {
                if (i > 0) json << ", ";
                json << R"(")" << results[i] << R"(")";
            }
            
            json << R"(], "count": )" << std::min(results.size(), size_t(10)) << "}";
            res.code = 200;
            res.body = json.str();
            return res;
        } catch (const std::exception& e) {
            res.code = 500;
            res.body = R"({"error": "Internal server error"})";
            return res;
        }
    });

    CROW_ROUTE(app, "/remove/<string>")
    ([&trie](const std::string& word){
        crow::response res;
        res.add_header("Access-Control-Allow-Origin", "*");
        res.add_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE, PUT");
        res.add_header("Access-Control-Allow-Headers", "Content-Type, Authorization");
        res.add_header("Content-Type", "application/json");
        
        try {
            if (word.empty()) {
                res.code = 400;
                res.body = R"({"error": "Word cannot be empty"})";
                return res;
            }
            trie.remove(word);
            res.code = 200;
            res.body = R"({"success": true, "message": "Word removed", "word": ")" + word + R"("})";
            return res;
        } catch (const std::exception& e) {
            res.code = 500;
            res.body = R"({"error": "Internal server error"})";
            return res;
        }
    });

    app.port(8080).multithreaded().run();
}
