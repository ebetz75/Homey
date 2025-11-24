13:08:38.438 Running build in Washington, D.C., USA (East) – iad1
13:08:38.439 Build machine configuration: 2 cores, 8 GB
13:08:38.559 Cloning github.com/ebetz75/Homey (Branch: main, Commit: 419e9b9)
13:08:39.178 Cloning completed: 618.000ms
13:08:39.454 Restored build cache from previous deployment (HTf14BZNLHGTWUHzFKFxfVCMRtAQ)
13:08:39.969 Running "vercel build"
13:08:40.377 Vercel CLI 48.10.5
13:08:41.052 Installing dependencies...
13:08:47.911 
13:08:47.911 added 10 packages, removed 11 packages, and changed 10 packages in 7s
13:08:47.912 
13:08:47.912 45 packages are looking for funding
13:08:47.912   run `npm fund` for details
13:08:47.949 Running "npm run build"
13:08:48.071 
13:08:48.072 > homey-ai@1.0.0 build
13:08:48.072 > vite build
13:08:48.072 
13:08:48.385 [36mvite v5.4.21 [32mbuilding for production...[36m[39m
13:08:48.440 transforming...
13:08:48.990 [32m✓[39m 16 modules transformed.
13:08:48.999 [31mx[39m Build failed in 588ms
13:08:49.000 [31merror during build:
13:08:49.000 [31m[vite:build-import-analysis] [plugin vite:build-import-analysis] components/InsuranceView (21:83): Failed to parse source for import analysis because the content contains invalid JS syntax. If you are using JSX, make sure to name the file with the .jsx or .tsx extension.[31m
13:08:49.000 file: [36m/vercel/path0/components/InsuranceView:21:83[31m
13:08:49.000 [33m
13:08:49.000 19:     return (
13:08:49.000 20:       <div className="bg-white p-3 border border-slate-100 shadow-xl rounded-xl z-50">
13:08:49.000 21:         <p className="font-bold text-slate-800 mb-1">{label || payload[0].name}</p>
13:08:49.001                                                                                        ^
13:08:49.001 22:         <p className="text-indigo-600 font-semibold">
13:08:49.001 23:           ${payload[0].value.toLocaleString()}
13:08:49.001 [31m
13:08:49.001     at getRollupError (file:///vercel/path0/node_modules/rollup/dist/es/shared/parseAst.js:401:41)
13:08:49.001     at error (file:///vercel/path0/node_modules/rollup/dist/es/shared/parseAst.js:397:42)
13:08:49.001     at Object.error (file:///vercel/path0/node_modules/rollup/dist/es/shared/node-entry.js:22129:20)
13:08:49.001     at Object.error (file:///vercel/path0/node_modules/rollup/dist/es/shared/node-entry.js:21186:42)
13:08:49.001     at Object.transform (file:///vercel/path0/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:64913:14)[39m
13:08:49.020 Error: Command "npm run build" exited with 1
