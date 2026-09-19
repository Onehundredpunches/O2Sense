import { createServer, build } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

async function runEmpiricalAliasTests() {
  console.log('=== RUNNING EMPIRICAL ALIAS STRESS TESTS ===\n');

  const testCases = [
    { name: 'Relative without extension', specifier: './AnatomyScene3D' },
    { name: 'Relative with .tsx extension', specifier: './AnatomyScene3D.tsx' },
    { name: 'Parent relative without extension', specifier: '../components/AnatomyScene3D' },
    { name: 'Parent relative with .tsx extension', specifier: '../components/AnatomyScene3D.tsx' },
    { name: 'Absolute project path without extension', specifier: '/src/components/AnatomyScene3D' },
    { name: 'Absolute project path with .tsx extension', specifier: '/src/components/AnatomyScene3D.tsx' },
  ];

  let allPassed = true;

  for (const tc of testCases) {
    try {
      const virtualId = 'virtual:entry-' + tc.name.replace(/\s+/g, '-');
      const bundle = await build({
        root,
        mode: 'production',
        logLevel: 'silent',
        build: {
          write: false,
          rollupOptions: {
            input: virtualId,
            plugins: [
              {
                name: 'virtual-test-plugin',
                resolveId(id) {
                  if (id === virtualId) return id;
                  return null;
                },
                load(id) {
                  if (id === virtualId) {
                    return `import Anatomy from '${tc.specifier}'; console.log(Anatomy);`;
                  }
                  return null;
                }
              }
            ]
          }
        }
      });

      const output = Array.isArray(bundle) ? bundle[0].output : bundle.output;
      const jsChunk = output.find(c => c.type === 'chunk');
      const code = jsChunk ? jsChunk.code : '';

      // Check if Three.js leaked into the bundle
      const hasThree = code.includes('WebGLRenderer') || 
                       code.includes('PerspectiveCamera') || 
                       code.includes('OrbitControls') ||
                       code.includes('ACESFilmicToneMapping');

      // Check if stub code is present
      const hasStub = code.includes('anatomy-scene-3d-stub') || 
                      code.includes('Chế Độ Xem Giải Phẫu Đứng Dọc Sagittal Y Khoa');

      if (!hasThree && hasStub) {
        console.log(`[PASS] ${tc.name} (${tc.specifier}):`);
        console.log(`       -> Resolved to stub, 0 Three.js leakage.`);
      } else {
        allPassed = false;
        console.error(`[FAIL] ${tc.name} (${tc.specifier}):`);
        console.error(`       -> hasThree: ${hasThree}, hasStub: ${hasStub}`);
      }
    } catch (err) {
      allPassed = false;
      console.error(`[ERROR] ${tc.name} (${tc.specifier}):`, err.message);
    }
  }

  // Test Direct Stub Import (ensure no circular loop)
  try {
    const virtualStubId = 'virtual:entry-stub-direct';
    const bundle = await build({
      root,
      mode: 'production',
      logLevel: 'silent',
      build: {
        write: false,
        rollupOptions: {
          input: virtualStubId,
          plugins: [
            {
              name: 'virtual-stub-test',
              resolveId(id) {
                if (id === virtualStubId) return id;
                return null;
              },
              load(id) {
                if (id === virtualStubId) {
                  return `import AnatomyStub from './src/components/AnatomyScene3D.stub.tsx'; console.log(AnatomyStub);`;
                }
                return null;
              }
            }
          ]
        }
      }
    });
    console.log('[PASS] Direct AnatomyScene3D.stub.tsx import: Successfully resolves without infinite loop.');
  } catch (err) {
    allPassed = false;
    console.error('[FAIL] Direct stub import failed:', err.message);
  }

  // Test Dev Mode resolution to ensure DEV loads the REAL Three.js component
  try {
    const server = await createServer({
      root,
      mode: 'development',
      server: { port: 5199 }
    });
    
    // Resolve './AnatomyScene3D' from 'src/components/ModuleCView.tsx'
    const resolved = await server.pluginContainer.resolveId(
      './AnatomyScene3D',
      path.resolve(root, 'src/components/ModuleCView.tsx')
    );
    await server.close();

    if (resolved && resolved.id.includes('AnatomyScene3D.tsx') && !resolved.id.includes('stub')) {
      console.log(`[PASS] Dev mode resolution: Correctly resolves to REAL AnatomyScene3D.tsx:`);
      console.log(`       -> ${resolved.id}`);
    } else {
      allPassed = false;
      console.error(`[FAIL] Dev mode resolution did not resolve to real AnatomyScene3D.tsx:`, resolved);
    }
  } catch (err) {
    allPassed = false;
    console.error(`[ERROR] Dev mode test error:`, err.message);
  }

  console.log('\n=== SUMMARY ===');
  console.log('All alias stress tests passed:', allPassed);
  if (!allPassed) {
    process.exit(1);
  }
}

runEmpiricalAliasTests();
