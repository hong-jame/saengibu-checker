// 빌드: src/index.html 의 <!--INLINE:*--> 마커에 vendor 라이브러리를 인라인해
// 인터넷 없이 동작하는 단일 파일(index.html, 생기부점검기.html)을 생성한다.
import { readFileSync, writeFileSync } from 'node:fs';

const read = p => readFileSync(new URL(p, import.meta.url), 'utf8');
const src    = read('./src/index.html');
const xlsx   = read('./vendor/xlsx.full.min.js');
const pdf    = read('./vendor/pdf.min.js');
const worker = read('./vendor/pdf.worker.min.js');

// 인라인 시 </script> 조기 종료 방지(현재 라이브러리엔 없지만 방어적으로 이스케이프)
const guard = s => s.replace(/<\/script>/gi, '<\\/script>');

const out = src
  .split('<!--INLINE:xlsx-->').join(`<script>\n${guard(xlsx)}\n</script>`)
  .split('<!--INLINE:pdfjs-->').join(`<script>\n${guard(pdf)}\n</script>`)
  .split('<!--INLINE:pdfworker-->').join(`<script type="text/plain" id="pdfWorkerCode">\n${guard(worker)}\n</script>`);

if (out.includes('<!--INLINE:')) { console.error('✗ 남은 마커가 있습니다'); process.exit(1); }

for (const f of ['index.html', '생기부점검기.html']) {
  writeFileSync(new URL('./' + f, import.meta.url), out);
}
console.log(`✔ 빌드 완료 — ${(out.length/1024/1024).toFixed(2)} MB (index.html, 생기부점검기.html)`);
