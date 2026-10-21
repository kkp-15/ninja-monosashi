// みんなのものさし: 点の付け方と、答えの合言葉（/a/ で開く）
// 合言葉は読みやすい25字（0/O・1/I/L・B/8の取り違えが起きる字・S・Z・Q・U・V は使わない）の6けた。
// 中身は「お題の番号・正解の位置・ランダムな種」を1つの数にして、並べ替えてから25字で書いたもの。
// 6けたで作れる並び 2億4414万通りのうち、正しい合言葉になるのは 16万1600通り（約0.07%）。でたらめに入れてもほぼ通らない。
(function () {
  var ALPHA = '23456789ACDEFGHJKMNPRTWXY', LEN = 6, N = Math.pow(25, LEN);
  var MAXT = 200, SALT = 8, VALID = SALT * MAXT * 101;
  var A = 1103507, B = 91725531;
  function mulmod(a, b) { var hi = Math.floor(b / 16384), lo = b % 16384; return ((a * hi % N) * 16384 % N + a * lo) % N; }
  function inv(a) { var t = 0, nt = 1, r = N, nr = a % N, q, x; while (nr) { q = Math.floor(r / nr); x = t - q * nt; t = nt; nt = x; x = r - q * nr; r = nr; nr = x; } return (t % N + N) % N; }
  var AINV = inv(A);
  function toHalf(s) { return String(s || '').replace(/[！-～]/g, function (c) { return String.fromCharCode(c.charCodeAt(0) - 0xFEE0); }); }
  function norm(s) { return toHalf(s).toUpperCase().replace(/[^0-9A-Z]/g, ''); }
  function encode(ti, t) {
    var v = Math.floor(Math.random() * SALT) * MAXT * 101 + ti * 101 + t;
    var c = (mulmod(v, A) + B) % N, s = '';
    for (var i = 0; i < LEN; i++) { s = ALPHA[c % 25] + s; c = Math.floor(c / 25); }
    return s;
  }
  function decode(s, nTopics) {
    s = norm(s);
    if (s.length !== LEN) return null;
    var c = 0;
    for (var i = 0; i < LEN; i++) { var k = ALPHA.indexOf(s[i]); if (k < 0) return null; c = c * 25 + k; }
    var v = mulmod((c - B + N) % N, AINV);
    if (v >= VALID) return null;
    var x = v % (MAXT * 101), ti = Math.floor(x / 101), t = x % 101;
    if (nTopics != null && ti >= nTopics) return null;
    return { ti: ti, t: t };
  }
  var RANGE = { 4: 3, 3: 8, 2: 14 };
  window.MO_CODE = {
    ALPHA: ALPHA, LEN: LEN, encode: encode, decode: decode, norm: norm,
    show: function (s) { return s.slice(0, 3) + ' ' + s.slice(3); },
    validRate: VALID / N
  };
  window.MO_SCORE = {
    RANGE: RANGE,
    of: function (d) { return d <= RANGE[4] ? 4 : d <= RANGE[3] ? 3 : d <= RANGE[2] ? 2 : 0; },
    span: function (t, d) { return Math.max(0, t - d) + '〜' + Math.min(100, t + d); }
  };
})();
