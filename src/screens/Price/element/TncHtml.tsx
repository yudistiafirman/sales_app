import colors from "@/constants/colors";

const tncHTML = `<!DOCTYPE html>
<html>
<style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');
</style>
<body style="font-family:'Montserrat',sans-serif;font-size: 14px">
  <ol type="1">
    <!-- 1 -->
    <li>Harga <b>sudah</b> termasuk PPN 11%.</li> 
    </br>
    <!-- 2 -->
    <li>Mutu beton menggunakan mix design beton standar PT. Bangun Rancang Indonesia Kita.</li>
    </br>
    <!-- 3 -->
    <li>Harga akan ditinjau kembali apabila ada kenaikan <b>harga BBM</b>, <b>material dasar beton</b>  dan <b>perubahan kebijakan moneter oleh pemerintah</b>.</li>
    </br>
    <!-- 4 -->
    <li>Metode pembayaran: <b>Cash Before Delivery</b>.</li> 
    </br>
    <!-- 5 -->
    <li>Biaya pengetesan di luar lab PT. Bangun Rancang Indonesia Kita menjadi tanggung jawab pembeli dan pengetasannya disaksikan bersama.</li>
    </br>
    <!-- 6 -->
    <li>Semua biaya yang terjadi diluar penawaran harga ini, menjadi tanggung jawab pembeli.</li>
    </br>
    <!-- 7 -->
    <li>Pengiriman dari Plant : <b>Legok</b>.</li>
    </br>
    <!-- 8 -->
    <li>Pengiriman melalui jalan tol. Tarif yang akan dikenakan sesuai dengan biaya yang dikeluarkan dalam setiap pengiriman.</li>
    <!-- 9 -->
    </br>
    <li>Biaya tambahan akan dikenakan ke pembeli apabila ketentuan-ketentuan di bawah ini terpenuhi:</li>
    </br>
    <ol type="a">
    <!-- a -->
    <li>Pembongkaran lebih dari <b>2 jam</b> dikenakan biaya sebesar <b>Rp 150.000,- per jam</b>.</li>
    </br>
    <!-- b -->
    <li>Pengiriman <b>kurang dari 7m<sup>3</sup></b>.</li>
    </br>
    <!-- TABLE B -->
    <div className=".tableContainer">
      <div style="background-color:${colors.primary};height:38px;display:flex;flex-direction:row;">
          <div style="flex:1.1;justify-content:center;display:flex;align-items:center;font-family:'Montserrat',sans-serif;font-size: 14px;color:${colors.white}"><b>Muatan Truk Mixer</b></div>
          <div style="flex:1;justify-content:center;display:flex;align-items:center;font-family:'Montserrat',sans-serif;font-size: 14px;color:${colors.white}"><b>Biaya (Rp/m<sup>3</sup>)</b></div>
      </div>
      <div style="background-color:${colors.white};height:38px;display:flex;flex-direction:row;">
         <div style="flex:1.1;justify-content:center;display:flex;align-items:center;font-family:'Montserrat',sans-serif;font-size: 14px;color:${colors.text.darker};border-right:1px solid ${colors.border.tab}">7 m<sup>3</sup></div>
         <div style="flex:1;justify-content:center;display:flex;align-items:center;font-family:'Montserrat',sans-serif;font-size: 14px;color:${colors.text.darker}">-</div>
     </div>
     <div style="background-color:${colors.chip.disabled};height:38px;display:flex;flex-direction:row;">
       <div style="flex:1.1;justify-content:center;display:flex;align-items:center;font-family:'Montserrat',sans-serif;font-size: 14px;color:${colors.text.darker};border-right:1px solid ${colors.border.tab}">5-6 m<sup>3</sup></div>
       <div style="flex:1;justify-content:center;display:flex;align-items:center;font-family:'Montserrat',sans-serif;font-size: 14px;color:${colors.text.darker}">250.000</div>
     </div>
     <div style="background-color:${colors.white};height:38px;display:flex;flex-direction:row;">
       <div style="flex:1.1;justify-content:center;display:flex;align-items:center;font-family:'Montserrat',sans-serif;font-size: 14px;color:${colors.text.darker};border-right:1px solid ${colors.border.tab}"><u><</u>4 m<sup>3</sup></div>
       <div style="flex:1;justify-content:center;display:flex;align-items:center;font-family:'Montserrat',sans-serif;font-size: 14px;color:${colors.text.darker}">500.000</div>
    </div>
    </div>
    <!-- TABLE B -->
    <!-- c -->
    </br>
    </br>
    <li>Jarak antara lokasi proyek dan Batching Plant <b>lebih dari 20km</b>.</li>
    </br>
    <!-- TABLE C -->
    <div className=".tableContainer">
    <div style="background-color:${colors.primary};height:38px;display:flex;flex-direction:row;">
        <div style="flex:1.1;justify-content:center;display:flex;align-items:center;font-family:'Montserrat',sans-serif;font-size: 14px;color:${colors.white}"><b>Jarak</b></div>
        <div style="flex:1;justify-content:center;display:flex;align-items:center;font-family:'Montserrat',sans-serif;font-size: 14px;color:${colors.white}"><b>Biaya (Rp/m<sup>3</sup>)</b></div>
    </div>
    <div style="background-color:${colors.white};height:38px;display:flex;flex-direction:row;">
       <div style="flex:1.1;justify-content:center;display:flex;align-items:center;font-family:'Montserrat',sans-serif;font-size: 14px;color:${colors.text.darker};border-right:1px solid ${colors.border.tab}">0 - 20 KM</div>
       <div style="flex:1;justify-content:center;display:flex;align-items:center;font-family:'Montserrat',sans-serif;font-size: 14px;color:${colors.text.darker}">-</div>
   </div>
   <div style="background-color:${colors.chip.disabled};height:38px;display:flex;flex-direction:row;">
     <div style="flex:1.1;justify-content:center;display:flex;align-items:center;font-family:'Montserrat',sans-serif;font-size: 14px;color:${colors.text.darker};border-right:1px solid ${colors.border.tab}">21 - 25 KM</div>
     <div style="flex:1;justify-content:center;display:flex;align-items:center;font-family:'Montserrat',sans-serif;font-size: 14px;color:${colors.text.darker}">20.000</div>
   </div>
   <div style="background-color:${colors.white};height:38px;display:flex;flex-direction:row;">
     <div style="flex:1.1;justify-content:center;display:flex;align-items:center;font-family:'Montserrat',sans-serif;font-size: 14px;color:${colors.text.darker};border-right:1px solid ${colors.border.tab}">26 - 30 KM</div>
     <div style="flex:1;justify-content:center;display:flex;align-items:center;font-family:'Montserrat',sans-serif;font-size: 14px;color:${colors.text.darker}">40.000</div>
  </div>
  <div style="background-color:${colors.chip.disabled};height:38px;display:flex;flex-direction:row;">
    <div style="flex:1.1;justify-content:center;display:flex;align-items:center;font-family:'Montserrat',sans-serif;font-size: 14px;color:${colors.text.darker};border-right:1px solid ${colors.border.tab}">31 - 35 KM</div>
    <div style="flex:1;justify-content:center;display:flex;align-items:center;font-family:'Montserrat',sans-serif;font-size: 14px;color:${colors.text.darker}">60.000</div>
</div>
<div style="background-color:${colors.white};height:38px;display:flex;flex-direction:row;">
  <div style="flex:1.1;justify-content:center;display:flex;align-items:center;font-family:'Montserrat',sans-serif;font-size: 14px;color:${colors.text.darker};border-right:1px solid ${colors.border.tab}">36 - 40 KM</div>
  <div style="flex:1;justify-content:center;display:flex;align-items:center;font-family:'Montserrat',sans-serif;font-size: 14px;color:${colors.text.darker}">80.000</div>
</div>
  </div>
  <!-- TABLE C -->
  </ol> 
  </ol>  
</body>
</html>`;

export default tncHTML;
