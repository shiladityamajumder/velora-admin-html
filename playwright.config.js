import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir:'./tests', fullyParallel:false, workers:1, timeout:45000,
  reporter:[['list'],['json',{outputFile:'artifacts/browser-tests.json'}]],
  use:{baseURL:process.env.VELORA_TEST_URL || 'http://127.0.0.1:3200',headless:true,viewport:{width:1440,height:1000},trace:'retain-on-failure'},
});
