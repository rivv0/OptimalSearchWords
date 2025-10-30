#define ASIO_STANDALONE
#include "crow_all.h"
#include "trie.h"
#include <string>
#include <sstream>
#include <fstream>
#include <vector>
#include <iostream>
#include <ctime>
#include <cstdlib>

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

void loadDefaultWords(Trie& trie);

void loadWordsFromFile(Trie& trie, const std::string& filename) {
    std::ifstream file(filename);
    if (file.is_open()) {
        std::string word;
        int count = 0;
        while (std::getline(file, word)) {
            if (!word.empty()) {
                trie.insert(word);
                count++;
            }
        }
        file.close();
        std::cout << "Loaded " << count << " words from " << filename << std::endl;
        return;
    }
    std::cout << "Could not open " << filename << ", loading default words..." << std::endl;
    loadDefaultWords(trie);
}

void loadDefaultWords(Trie& trie) {
    std::vector<std::string> commonWords = {
        "apple", "application", "apply", "approach", "appropriate", "area", "argue", "arm", "army", "around", "arrive", "art", "article", "artist", "as", "ask", "assume", "at", "attack", "attempt", "attend", "attention", "attitude", "attract", "audience", "author", "authority", "available", "avoid", "away",
        "baby", "back", "bad", "bag", "ball", "bank", "bar", "base", "basic", "battle", "be", "beat", "beautiful", "because", "become", "bed", "before", "begin", "behavior", "behind", "believe", "benefit", "best", "better", "between", "beyond", "big", "bill", "billion", "bit", "black", "blood", "blow", "blue", "board", "boat", "body", "book", "born", "both", "box", "boy", "break", "bring", "brother", "budget", "build", "building", "business", "but", "buy", "by",
        "call", "camera", "campaign", "can", "cancer", "candidate", "capital", "car", "card", "care", "career", "carry", "case", "catch", "cause", "cell", "center", "central", "century", "certain", "certainly", "chair", "challenge", "chance", "change", "character", "charge", "check", "child", "choice", "choose", "church", "citizen", "city", "civil", "claim", "class", "clear", "clearly", "close", "coach", "cold", "collection", "college", "color", "come", "commercial", "common", "community", "company", "compare", "computer", "concern", "condition", "conference", "congress", "consider", "consumer", "contain", "continue", "control", "cost", "could", "country", "couple", "course", "court", "cover", "create", "crime", "cultural", "culture", "cup", "current", "customer", "cut",
        "dark", "data", "daughter", "day", "dead", "deal", "death", "debate", "decade", "decide", "decision", "deep", "defense", "degree", "democrat", "democratic", "describe", "design", "despite", "detail", "determine", "develop", "development", "die", "difference", "different", "difficult", "dinner", "direction", "director", "discover", "discuss", "discussion", "disease", "do", "doctor", "dog", "door", "down", "draw", "dream", "drive", "drop", "drug", "during", "each", "early", "east", "easy", "eat", "economic", "economy", "edge", "education", "effect", "effort", "eight", "either", "election", "else", "employee", "end", "energy", "enjoy", "enough", "enter", "entire", "environment", "environmental", "especially", "establish", "even", "evening", "event", "ever", "every", "everybody", "everyone", "everything", "evidence", "exactly", "example", "executive", "exist", "expect", "experience", "expert", "explain", "eye",
        "face", "fact", "factor", "fail", "fall", "family", "far", "fast", "father", "fear", "federal", "feel", "feeling", "few", "field", "fight", "figure", "fill", "film", "final", "finally", "financial", "find", "fine", "finger", "finish", "fire", "firm", "first", "fish", "five", "floor", "fly", "focus", "follow", "food", "foot", "for", "force", "foreign", "forget", "form", "former", "forward", "four", "free", "friend", "from", "front", "full", "fund", "future",
        "game", "garden", "gas", "general", "generation", "get", "girl", "give", "glass", "go", "goal", "good", "government", "great", "green", "ground", "group", "grow", "growth", "guess", "gun", "guy",
        "hair", "half", "hand", "hang", "happen", "happy", "hard", "have", "he", "head", "health", "hear", "heart", "heat", "heavy", "help", "her", "here", "herself", "high", "him", "himself", "his", "history", "hit", "hold", "home", "hope", "hospital", "hot", "hotel", "hour", "house", "how", "however", "huge", "human", "hundred",
        "idea", "identify", "if", "image", "imagine", "impact", "important", "improve", "in", "include", "including", "increase", "indeed", "indicate", "individual", "industry", "information", "inside", "instead", "institution", "interest", "interesting", "international", "interview", "into", "investment", "involve", "issue", "it", "item", "its", "itself",
        "job", "join", "just",
        "keep", "key", "kid", "kill", "kind", "kitchen", "know", "knowledge",
        "land", "language", "large", "last", "late", "later", "laugh", "law", "lawyer", "lay", "lead", "leader", "learn", "least", "leave", "left", "leg", "legal", "less", "let", "letter", "level", "lie", "life", "light", "like", "line", "list", "listen", "little", "live", "local", "long", "look", "lose", "loss", "lot", "love", "low",
        "machine", "magazine", "main", "maintain", "major", "make", "man", "manage", "management", "manager", "many", "market", "marriage", "material", "matter", "may", "maybe", "me", "mean", "measure", "media", "medical", "meet", "meeting", "member", "memory", "mention", "message", "method", "middle", "might", "military", "million", "mind", "minute", "miss", "mission", "model", "modern", "moment", "money", "month", "more", "morning", "most", "mother", "mouth", "move", "movement", "movie", "Mr", "Mrs", "much", "music", "must", "my", "myself",
        "name", "nation", "national", "natural", "nature", "near", "nearly", "necessary", "need", "network", "never", "new", "news", "newspaper", "next", "nice", "night", "no", "none", "nor", "north", "not", "note", "nothing", "notice", "now", "number",
        "occur", "of", "off", "offer", "office", "officer", "official", "often", "oh", "oil", "ok", "old", "on", "once", "one", "only", "onto", "open", "operation", "opportunity", "option", "or", "order", "organization", "other", "others", "our", "out", "outside", "over", "own", "owner",
        "page", "pain", "painting", "paper", "parent", "part", "participant", "particular", "particularly", "partner", "party", "pass", "past", "patient", "pattern", "pay", "peace", "people", "per", "perform", "performance", "perhaps", "period", "person", "personal", "phone", "physical", "pick", "picture", "piece", "place", "plan", "plant", "play", "player", "PM", "point", "police", "policy", "political", "politics", "poor", "popular", "population", "position", "positive", "possible", "power", "practice", "prepare", "present", "president", "pressure", "pretty", "prevent", "price", "private", "probably", "problem", "process", "produce", "product", "production", "professional", "professor", "program", "project", "property", "protect", "prove", "provide", "public", "pull", "purpose", "push", "put",
        "quality", "question", "quickly", "quite",
        "race", "radio", "raise", "range", "rate", "rather", "reach", "read", "ready", "real", "reality", "realize", "really", "reason", "receive", "recent", "recently", "recognize", "record", "red", "reduce", "reflect", "region", "relate", "relationship", "religious", "remain", "remember", "remove", "report", "represent", "republican", "require", "research", "resource", "respond", "response", "responsibility", "rest", "result", "return", "reveal", "rich", "right", "rise", "risk", "road", "rock", "role", "room", "rule", "run",
        "safe", "same", "save", "say", "scene", "school", "science", "scientist", "score", "sea", "season", "seat", "second", "section", "security", "see", "seek", "seem", "sell", "send", "senior", "sense", "series", "serious", "serve", "service", "set", "seven", "several", "sex", "sexual", "shake", "share", "she", "shoot", "short", "shot", "should", "shoulder", "show", "side", "sign", "significant", "similar", "simple", "simply", "since", "sing", "single", "sister", "sit", "site", "situation", "six", "size", "skill", "skin", "small", "smile", "so", "social", "society", "soldier", "some", "somebody", "someone", "something", "sometimes", "son", "song", "soon", "sort", "sound", "source", "south", "southern", "space", "speak", "special", "specific", "speech", "spend", "sport", "spring", "staff", "stage", "stand", "standard", "star", "start", "state", "statement", "station", "stay", "step", "still", "stock", "stop", "store", "story", "strategy", "street", "strong", "structure", "student", "study", "stuff", "style", "subject", "success", "successful", "such", "suddenly", "suffer", "suggest", "summer", "support", "sure", "surface", "system",
        "table", "take", "talk", "task", "tax", "teach", "teacher", "team", "technology", "television", "tell", "ten", "tend", "term", "test", "than", "thank", "that", "the", "their", "them", "themselves", "then", "theory", "there", "these", "they", "thing", "think", "third", "this", "those", "though", "thought", "thousand", "threat", "three", "through", "throughout", "throw", "thus", "time", "to", "today", "together", "tonight", "too", "top", "total", "tough", "toward", "town", "trade", "traditional", "training", "travel", "treat", "treatment", "tree", "trial", "trip", "trouble", "true", "truth", "try", "turn", "TV", "two", "type",
        "under", "understand", "unit", "until", "up", "upon", "us", "use", "used", "useful", "user", "usually",
        "value", "various", "very", "victim", "view", "violence", "visit", "voice", "vote",
        "wait", "walk", "wall", "want", "war", "watch", "water", "way", "we", "weapon", "wear", "week", "weight", "well", "west", "western", "what", "whatever", "when", "where", "whether", "which", "while", "white", "who", "whole", "whom", "whose", "why", "wide", "wife", "will", "win", "wind", "window", "wish", "with", "within", "without", "woman", "wonder", "word", "work", "worker", "world", "worry", "would", "write", "writer", "wrong",
        "yard", "yeah", "year", "yes", "yet", "you", "young", "your", "yourself"
    };
    
    std::cout << "Loading " << commonWords.size() << " default words into trie..." << std::endl;
    for (const auto& word : commonWords) {
        trie.insert(word);
    }
    std::cout << "Default word loading complete!" << std::endl;
}

int main() {
    crow::App<CORS> app;
    Trie trie;
    
    loadWordsFromFile(trie, "words.txt");

    CROW_ROUTE(app, "/")
    ([](){
        crow::response res;
        res.add_header("Access-Control-Allow-Origin", "*");
        res.add_header("Content-Type", "application/json");
        res.code = 200;
        res.body = R"({"status": "ok", "message": "Word Lookup API is running", "endpoints": ["/search/<word>", "/insert/<word>", "/remove/<word>", "/define/<word>"]})";
        return res;
    });

    CROW_ROUTE(app, "/health")
    ([](){
        crow::response res;
        res.add_header("Access-Control-Allow-Origin", "*");
        res.add_header("Content-Type", "application/json");
        res.code = 200;
        res.body = R"({"status": "healthy", "timestamp": ")" + std::to_string(time(nullptr)) + R"("})";
        return res;
    });

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
            
            size_t limit = std::min(results.size(), size_t(8));
            for (size_t i = 0; i < limit; ++i) {
                if (i > 0) json << ", ";
                json << R"(")" << results[i] << R"(")";
            }
            
            json << R"(], "count": )" << limit << "}";
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

    CROW_ROUTE(app, "/define/<string>")
    ([](const std::string& word){
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
            
            res.code = 200;
            res.body = R"({"word": ")" + word + R"(", "message": "Definition endpoint - integrate with dictionary API for real definitions"})";
            return res;
        } catch (const std::exception& e) {
            res.code = 500;
            res.body = R"({"error": "Internal server error"})";
            return res;
        }
    });

    int port = 8080;
    const char* port_env = std::getenv("PORT");
    if (port_env) {
        port = std::atoi(port_env);
        std::cout << "Using PORT from environment: " << port << std::endl;
    } else {
        std::cout << "Using default port: " << port << std::endl;
    }
    
    std::cout << "Starting Word Lookup API server..." << std::endl;
    std::cout << "Available endpoints:" << std::endl;
    std::cout << "  GET  /           - API status" << std::endl;
    std::cout << "  GET  /health     - Health check" << std::endl;
    std::cout << "  GET  /search/<word> - Search autocomplete" << std::endl;
    std::cout << "  GET  /insert/<word> - Insert word" << std::endl;
    std::cout << "  GET  /remove/<word> - Remove word" << std::endl;
    std::cout << "  GET  /define/<word> - Get definition" << std::endl;
    
    app.port(port).multithreaded().run();
}
