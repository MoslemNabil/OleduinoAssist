export const CANVAS_WIDTH = 128;
export const CANVAS_HEIGHT = 64;

export const BOARD_PRESETS = {
  arduino_uno: { name: 'Arduino Uno/Nano', i2c: 'A4 (SDA), A5 (SCL)', spi: '13 (SCK), 11 (MOSI), 10 (CS), 9 (DC)' },
  esp32: { name: 'ESP32', i2c: '21 (SDA), 22 (SCL)', spi: '18 (SCK), 23 (MOSI), 5 (CS), 2 (DC)' },
  esp32_c3: { name: 'ESP32-C3', i2c: '8 (SDA), 9 (SCL)', spi: '4 (SCK), 6 (MOSI), 7 (CS), 3 (DC)' },
  esp8266: { name: 'ESP8266', i2c: 'D2 (SDA), D1 (SCL)', spi: 'D5 (SCK), D7 (MOSI), D8 (CS), D3 (DC)' },
  pico: { name: 'Raspberry Pi Pico', i2c: 'GP4 (SDA), GP5 (SCL)', spi: 'GP18 (SCK), GP19 (MOSI), GP17 (CS), GP16 (DC)' },
  ch552: { name: 'CH552 (WeAct Studio)', i2c: 'P1.6 (SDA), P1.7 (SCL)', spi: 'P1.7 (SCK), P1.5 (MOSI), P1.4 (CS), P1.1 (DC)' }
};

export const U8G2_CONSTRUCTORS = {
  i2c: 'U8G2_SSD1306_128X64_NONAME_F_HW_I2C u8g2(U8G2_R0, /* reset=*/ U8X8_PIN_NONE);',
  spi: 'U8G2_SSD1306_128X64_NONAME_F_4W_HW_SPI u8g2(U8G2_R0, /* cs=*/ 10, /* dc=*/ 9, /* reset=*/ 8); // Update pins for your board'
};
