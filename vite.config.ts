import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: { // 프록시를 위한 서버추가 
  port: 5173, 
  proxy: { //개발 서버(Vite)와 실제 백엔드가 다른 도메인/포트에 있을 때 CORS 문제 없이 API 요청 테스트 가
    '/api': {
      target: 'http://211.188.52.190',  //실제 api 주소 
      changeOrigin: true, // localhost -> target 서버 주소로 바꿈 
      secure: false,  //https 인증서 무시
      headers: { //headers.Host: 특정 Host 헤더 지정 필요 시  
        Host: 'bidgo.bidtechlab.co.kr', // 내가 이 도메인으로 요청한거라고 알려주는 세팅 
      },
    },
  },
},
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), //__dirname 현재파일이 있는 폴더를 항상알려줌
    },
  },
})
