var filter_words = ["4r5e","5h1t","5hit","a55","anal","anus","ar5e","arrse","arse","ass","ass-fucker","asses","assfucker","assfukka","asshole","assholes",
"asswhole","a_s_s","b!tch","b00bs","b17ch","b1tch","ballbag","balls","ballsack","bastard","beastial","beastiality","bellend","bestial","bestiality","bi+ch",
"biatch","bitch","bitcher","bitchers","bitches","bitchin","bitching","bloody","blow job","blowjob","blowjobs","boiolas","bollock","bollok","boner","boob",
"boobs","booobs","boooobs","booooobs","booooooobs","breasts","buceta","bugger","bum","bunny fucker","butt","butthole","buttmuch","buttplug","c0ck","c0cksucker",
"carpet muncher","cawk","chink","cipa","cl1t","clit","clitoris","clits","cnut","cock","cock-sucker","cockface","cockhead","cockmunch","cockmuncher","cocks",
"cocksuck ","cocksucked ","cocksucker","cocksucking","cocksucks ","cocksuka","cocksukka","cok","cokmuncher","coksucka","coon","cox","crap","cum","cummer",
"cumming","cums","cumshot","cunilingus","cunillingus","cunnilingus","cunt","cuntlick ","cuntlicker ","cuntlicking ","cunts","cyalis","cyberfuc","cyberfuck ",
"cyberfucked ","cyberfucker","cyberfuckers","cyberfucking ","d1ck","damn","dick","dickhead","dildo","dildos","dink","dinks","dirsa","dlck","dog-fucker",
"doggin","dogging","donkeyribber","doosh","duche","dyke","ejaculate","ejaculated","ejaculates ","ejaculating ","ejaculatings","ejaculation","ejakulate",
"f u c k","f u c k e r","f4nny","fag","fagging","faggitt","faggot","faggs","fagot","fagots","fags","fanny","fannyflaps","fannyfucker","fanyy","fatass","fcuk",
"fcuker","fcuking","feck","fecker","felching","fellate","fellatio","fingerfuck ","fingerfucked ","fingerfucker ","fingerfuckers","fingerfucking ","fingerfucks "
,"fistfuck","fistfucked ","fistfucker ","fistfuckers ","fistfucking ","fistfuckings ","fistfucks ","flange","fook","fooker","fuck","fucka","fucked","fucker",
"fuckers","fuckhead","fuckheads","fuckin","fucking","fuckings","fuckingshitmotherfucker","fuckme ","fucks","fuckwhit","fuckwit","fudge packer","fudgepacker",
"fuk","fuker","fukker","fukkin","fuks","fukwhit","fukwit","fux","fux0r","f_u_c_k","gangbang","gangbanged ","gangbangs ","gaylord","gaysex","goatse","God",
"god-dam","god-damned","goddamn","goddamned","hardcoresex ","hell","heshe","hoar","hoare","hoer","homo","hore","horniest","horny","hotsex","jack-off ","jackoff"
,"jap","jerk-off ","jism","jiz ","jizm ","jizz","kawk","knob","knobead","knobed","knobend","knobhead","knobjocky","knobjokey","kock","kondum","kondums","kum",
"kummer","kumming","kums","kunilingus","l3i+ch","l3itch","labia","lmfao","lust","lusting","m0f0","m0fo","m45terbate","ma5terb8","ma5terbate","masochist",
"master-bate","masterb8","masterbat*","masterbat3","masterbate","masterbation","masterbations","masturbate","mo-fo","mof0","mofo","mothafuck","mothafucka",
"mothafuckas","mothafuckaz","mothafucked ","mothafucker","mothafuckers","mothafuckin","mothafucking ","mothafuckings","mothafucks","mother fucker","motherfuck",
"motherfucked","motherfucker","motherfuckers","motherfuckin","motherfucking","motherfuckings","motherfuckka","motherfucks","muff","mutha","muthafecker","muthafuckker"
,"muther","mutherfucker","n1gga","n1gger","nazi","nigg3r","nigg4h","nigga","niggah","niggas","niggaz","nigger","niggers ","nob","nob jokey","nobhead","nobjocky",
"nobjokey","numbnuts","nutsack","orgasim ","orgasims ","orgasm","orgasms ","p0rn","pawn","pecker","penis","penisfucker","phonesex","phuck","phuk","phuked","phuking"
,"phukked","phukking","phuks","phuq","pigfucker","pimpis","piss","pissed","pisser","pissers","pisses ","pissflaps","pissin ","pissing","pissoff ","poop","porn",
"porno","pornography","pornos","prick","pricks ","pron","pube","pusse","pussi","pussies","pussy","pussys ","rectum","retard","rimjaw","rimming","s hit","s.o.b.",
"sadist","schlong","screwing","scroat","scrote","scrotum","semen","sex","sh!+","sh!t","sh1t","shag","shagger","shaggin","shagging","shemale","shi+","shit",
"shitdick","shite","shited","shitey","shitfuck","shitfull","shithead","shiting","shitings","shits","shitted","shitter","shitters ","shitting","shittings","shitty "
,"skank","slut","sluts","smegma","smut","snatch","son-of-a-bitch","spac","spunk","s_h_i_t","t1tt1e5","t1tties","teets","teez","testical","testicle","tit",
"titfuck","tits","titt","tittie5","tittiefucker","titties","tittyfuck","tittywank","titwank","tosser","turd","tw4t","twat","twathead","twatty","twunt","twunter"
,"v14gra","v1gra","vagina","viagra","vulva","w00se","wang","wank","wanker","wanky","whoar","whore","willies","willy","xrated","xxx"];


function FastScanner(words) {
    this.root = buildTree(words);
}

function buildTree(words) {
    words = dedupAndSort(words);
    var root = {next: {}, val: null, back: null, parent: null, accept: false};
    for (var i = 0; i < words.length; i++) {
        addWord(root, words[i]);
    }
    fallbackAll(root);
    return root;
}

function dedupAndSort(words) {
    words = words.map(function (word) { return word.trim() });
    words = words.filter(function (word) { return word.length > 0 });
    var seen = {};
    var out = [];
    for (var i = 0; i < words.length; i++) {
        var word = words[i];
        if (!seen[word]) {
            seen[word] = true;
            out[out.length] = word;
        }
    }
    return out.sort();
}

function addWord(root, word) {
    var current = root;
    for (var i = 0; i < word.length; i++) {
        var c = word[i];
        var next = current.next[c];
        if (!next) {
            current.next[c] = {
                next: {},
                val: c,
                accept: false,
                back: root,
                parent: current
            }
        }
        current = current.next[c];
    }
    current.accept = true;
}

function fallbackAll(root) {
    var curExpands = Object.values(root.next);
    while (curExpands.length > 0) {
        var nextExpands = [];
        for (var i = 0; i < curExpands.length; i++) {
            var node = curExpands[i];
            for (var c in node.next) {
                nextExpands.push(node.next[c]);
            }
            var parent = node.parent
            var back = parent.back
            while (back != null) {
                // 匹配父节点的跳跃节点的子节点
                var child = back.next[node.val]
                if (child) {
                    node.back = child
                    break
                }
                back = back.back
            }
        }
        curExpands = nextExpands
    }
}

function fallback(root, word) {
    var current = root.next[word[0]]
    for (var i = 1; i < word.length; i++) {
        var c = word[i]
        var parent = current.parent
        var back = parent.back
        while (back != null) {
            // 匹配父节点的跳跃节点的子节点
            var child = back.next[current.val]
            if (child) {
                current.back = child
                break
            }
            back = back.back
        }
        current = current.next[c]
    }
}

function selectLongest(offsetWords) {
    var stands = {}
    for (var i = 0; i < offsetWords.length; i++) {
        var offword = offsetWords[i];
        var word = stands[offword[0]];
        if (!word || word.length < offword[1].length) {
            stands[offword[0]] = offword[1];
        }
    }
    var offsets = Object.keys(stands).map(function (key) {
        return parseInt(key)
    }).sort(function (a, b) {
        return a - b
    });
    return offsets.map(function (off) {
        return [off, stands[off]]
    });
}

function collect(node) {
    var word = [];
    while (node.val != null) {
        word.unshift(node.val);
        node = node.parent;
    }
    return word.join('')
}

FastScanner.prototype.search = function search(content, options) {
    var offWords = [];
    var current = this.root;
    options = options || {longest:true}
    for (var i = 0; i < content.length; i++) {
        var c = content[i];
        var next = current.next[c];
        if (!next) {
            var back = current.back
            while (back != null) {
                next = back.next[c]
                if (next) {
                    break
                }
                back = back.back
            }
        }
        if (next) {
            var back = next;
            do {
                if (back.accept) {
                    var word = collect(back)
                    offWords.push([i - word.length + 1, word]);
                    if (options.quick) {
                        return offWords
                    }
                }
                back = back.back
            } while (back != this.root);
            current = next;
            continue
        }
        current = this.root
    }
    if (options.longest) {
        return selectLongest(offWords)
    }
    return offWords
}

FastScanner.prototype.hits = function hits(content, options) {
    var offWords = this.search(content, options);
    var seen = {};
    for (var i = 0; i < offWords.length; i++) {
        var word = offWords[i][1];
        var count = seen[word] || 0;
        seen[word] = count + 1
    }
    return seen
}

FastScanner.prototype.replace = function search(content, options) {
    var allfind = this.hits(content);
    for (var f in allfind) {
        var repstr = "";
        for (var k in f) {
            repstr = repstr + "*";
        }

        content = content.replace(f, repstr);
    }
    return content;
}


var scan = new FastScanner(filter_words);


module.exports.scan = scan;
