import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { AnatomyScene3D, AnatomyScene3DProps } from '../src/components/AnatomyScene3D.stub';

interface TestResult {
  category: string;
  name: string;
  passed: boolean;
  warnings: string[];
  error?: string;
  domAttributes?: Record<string, string | null>;
}

const results: TestResult[] = [];

// Warning/Error interceptor
function runWithConsoleSpy<T>(fn: () => T): { result: T | null; warnings: string[]; errors: string[] } {
  const warnings: string[] = [];
  const errors: string[] = [];
  const origWarn = console.warn;
  const origError = console.error;

  console.warn = (...args: any[]) => {
    warnings.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
    origWarn(...args);
  };
  console.error = (...args: any[]) => {
    errors.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
    origError(...args);
  };

  let result: T | null = null;
  try {
    result = fn();
  } finally {
    console.warn = origWarn;
    console.error = origError;
  }

  return { result, warnings, errors };
}

// Extract attributes from rendered HTML string
function parseStubAttributes(html: string): Record<string, string> {
  const match = html.match(/<div[^>]*data-testid="anatomy-scene-3d-stub"[^>]*>/);
  if (!match) return {};
  const tag = match[0];
  const attrs: Record<string, string> = {};
  const attrRegex = /([a-zA-Z0-9_-]+)="([^"]*)"/g;
  let attrMatch;
  while ((attrMatch = attrRegex.exec(tag)) !== null) {
    attrs[attrMatch[1]] = attrMatch[2];
  }
  return attrs;
}

function testPropCase(
  category: string,
  name: string,
  props: AnatomyScene3DProps,
  attributeExpectations?: Record<string, string>
) {
  const { result: html, warnings, errors } = runWithConsoleSpy(() => {
    return ReactDOMServer.renderToString(React.createElement(AnatomyScene3D, props));
  });

  const allWarnings = [...warnings, ...errors];
  let passed = true;
  let errorMsg: string | undefined;

  if (!html) {
    passed = false;
    errorMsg = 'Render produced null/empty html';
  } else if (!html.includes('data-testid="anatomy-scene-3d-stub"')) {
    passed = false;
    errorMsg = 'Missing data-testid="anatomy-scene-3d-stub" in output';
  }

  const attrs = html ? parseStubAttributes(html) : {};

  if (attributeExpectations && passed) {
    for (const [key, expectedVal] of Object.entries(attributeExpectations)) {
      if (attrs[key] !== expectedVal) {
        passed = false;
        errorMsg = `Attribute mismatch on ${key}: expected "${expectedVal}", found "${attrs[key]}"`;
        break;
      }
    }
  }

  results.push({
    category,
    name,
    passed: passed && allWarnings.length === 0,
    warnings: allWarnings,
    error: errorMsg,
    domAttributes: attrs,
  });
}

console.log('===============================================================');
console.log('STARTING EMPIRICAL TEST SUITE: AnatomyScene3D.stub.tsx');
console.log('===============================================================');

// 1. Clinical Nominal Matrix
const statuses: Array<'open' | 'narrowed' | 'collapsed' | 'reopening'> = [
  'open',
  'narrowed',
  'collapsed',
  'reopening',
];

for (let step = 1; step <= 5; step++) {
  for (const status of statuses) {
    const airflow = status === 'open' ? 100 : status === 'narrowed' ? 50 : status === 'collapsed' ? 0 : 80;
    const spo2 = status === 'collapsed' ? 82 : status === 'narrowed' ? 91 : 98;
    const arousal = step === 5;
    const sympathetic = step >= 4;

    testPropCase(
      'Nominal Clinical Matrix',
      `Step ${step} | ${status} | Airflow:${airflow}% | SpO2:${spo2}% | Arousal:${arousal} | Sympathetic:${sympathetic}`,
      {
        step,
        airwayStatus: status,
        airflowPercent: airflow,
        spo2Percent: spo2,
        isBrainArousal: arousal,
        isSympathetic: sympathetic,
      },
      {
        'data-testid': 'anatomy-scene-3d-stub',
        'data-step': String(step),
        'data-airway-status': status,
        'data-airflow': String(airflow),
        'data-spo2': String(spo2),
        'data-brain-arousal': arousal ? 'true' : 'false',
        'data-sympathetic': sympathetic ? 'true' : 'false',
      }
    );
  }
}

// 2. Boundary Physiological Extremes
testPropCase(
  'Physiological Boundary Extremes',
  '0% SpO2 (Severe Hypoxemia / Anoxia)',
  {
    step: 4,
    airwayStatus: 'collapsed',
    airflowPercent: 0,
    spo2Percent: 0,
    isBrainArousal: false,
    isSympathetic: true,
  },
  {
    'data-spo2': '0',
    'data-airflow': '0',
    'data-airway-status': 'collapsed',
  }
);

testPropCase(
  'Physiological Boundary Extremes',
  '100% SpO2 and 100% Airflow (Peak Saturation)',
  {
    step: 1,
    airwayStatus: 'open',
    airflowPercent: 100,
    spo2Percent: 100,
    isBrainArousal: false,
    isSympathetic: false,
  },
  {
    'data-spo2': '100',
    'data-airflow': '100',
    'data-airway-status': 'open',
  }
);

testPropCase(
  'Physiological Boundary Extremes',
  '150% Airflow (Hyperventilation overshoot)',
  {
    step: 5,
    airwayStatus: 'reopening',
    airflowPercent: 150,
    spo2Percent: 96,
    isBrainArousal: true,
    isSympathetic: true,
  },
  {
    'data-airflow': '150',
  }
);

// 3. Adversarial / Edge Cases: Negative Values
testPropCase(
  'Adversarial: Negative Numbers',
  'Negative Airflow (-50%)',
  {
    step: 3,
    airwayStatus: 'collapsed',
    airflowPercent: -50,
    spo2Percent: 85,
    isBrainArousal: false,
    isSympathetic: true,
  },
  {
    'data-airflow': '-50',
  }
);

testPropCase(
  'Adversarial: Negative Numbers',
  'Extreme Negative Airflow (-99999%)',
  {
    step: 3,
    airwayStatus: 'collapsed',
    airflowPercent: -99999,
    spo2Percent: 85,
    isBrainArousal: false,
    isSympathetic: true,
  },
  {
    'data-airflow': '-99999',
  }
);

testPropCase(
  'Adversarial: Negative Numbers',
  'Negative SpO2 (-20%)',
  {
    step: 3,
    airwayStatus: 'collapsed',
    airflowPercent: 0,
    spo2Percent: -20,
    isBrainArousal: false,
    isSympathetic: true,
  },
  {
    'data-spo2': '-20',
  }
);

// 4. Adversarial: Extreme / Non-standard Steps
testPropCase(
  'Adversarial: Steps',
  'Step 0 (Out of lower bound)',
  {
    step: 0,
    airwayStatus: 'open',
    airflowPercent: 100,
    spo2Percent: 98,
    isBrainArousal: false,
    isSympathetic: false,
  },
  {
    'data-step': '0',
  }
);

testPropCase(
  'Adversarial: Steps',
  'Step -99 (Negative step)',
  {
    step: -99,
    airwayStatus: 'open',
    airflowPercent: 100,
    spo2Percent: 98,
    isBrainArousal: false,
    isSympathetic: false,
  },
  {
    'data-step': '-99',
  }
);

testPropCase(
  'Adversarial: Steps',
  'Step 999999 (Extreme positive step)',
  {
    step: 999999,
    airwayStatus: 'open',
    airflowPercent: 100,
    spo2Percent: 98,
    isBrainArousal: false,
    isSympathetic: false,
  },
  {
    'data-step': '999999',
  }
);

testPropCase(
  'Adversarial: Steps',
  'Step 3.14159 (Float step)',
  {
    step: 3.14159,
    airwayStatus: 'collapsed',
    airflowPercent: 0,
    spo2Percent: 88,
    isBrainArousal: false,
    isSympathetic: false,
  },
  {
    'data-step': '3.14159',
  }
);

// 5. Adversarial: Invalid / Unusual airwayStatus
testPropCase(
  'Adversarial: airwayStatus',
  'Invalid airwayStatus: "obstructed_custom"',
  {
    step: 3,
    airwayStatus: 'obstructed_custom' as any,
    airflowPercent: 0,
    spo2Percent: 85,
    isBrainArousal: false,
    isSympathetic: true,
  },
  {
    'data-airway-status': 'obstructed_custom',
  }
);

testPropCase(
  'Adversarial: airwayStatus',
  'Empty string airwayStatus: ""',
  {
    step: 2,
    airwayStatus: '' as any,
    airflowPercent: 60,
    spo2Percent: 93,
    isBrainArousal: false,
    isSympathetic: false,
  },
  {
    'data-airway-status': '',
  }
);

testPropCase(
  'Adversarial: airwayStatus',
  'AirwayStatus with special characters and spaces',
  {
    step: 1,
    airwayStatus: '<script>alert("xss")</script>' as any,
    airflowPercent: 100,
    spo2Percent: 99,
    isBrainArousal: false,
    isSympathetic: false,
  }
);

// 6. Adversarial: Non-boolean boolean flags (truthy / falsy coercions)
testPropCase(
  'Adversarial: Booleans',
  'Truthiness check: isBrainArousal = 1, isSympathetic = "yes"',
  {
    step: 5,
    airwayStatus: 'reopening',
    airflowPercent: 80,
    spo2Percent: 95,
    isBrainArousal: 1 as any,
    isSympathetic: 'yes' as any,
  },
  {
    'data-brain-arousal': 'true',
    'data-sympathetic': 'true',
  }
);

testPropCase(
  'Adversarial: Booleans',
  'Falsiness check: isBrainArousal = 0, isSympathetic = null',
  {
    step: 1,
    airwayStatus: 'open',
    airflowPercent: 100,
    spo2Percent: 98,
    isBrainArousal: 0 as any,
    isSympathetic: null as any,
  },
  {
    'data-brain-arousal': 'false',
    'data-sympathetic': 'false',
  }
);

// 7. Extreme Adversarial: Infinity and Type Mismatches
testPropCase(
  'Adversarial: Type Extremes',
  'Infinity in step, airflow, spo2',
  {
    step: Infinity,
    airwayStatus: 'open',
    airflowPercent: Infinity,
    spo2Percent: Infinity,
    isBrainArousal: true,
    isSympathetic: true,
  },
  {
    'data-step': 'Infinity',
    'data-airflow': 'Infinity',
    'data-spo2': 'Infinity',
  }
);

testPropCase(
  'Adversarial: Type Extremes',
  '-Infinity in step, airflow, spo2',
  {
    step: -Infinity,
    airwayStatus: 'narrowed',
    airflowPercent: -Infinity,
    spo2Percent: -Infinity,
    isBrainArousal: false,
    isSympathetic: false,
  },
  {
    'data-step': '-Infinity',
    'data-airflow': '-Infinity',
    'data-spo2': '-Infinity',
  }
);

testPropCase(
  'Adversarial: Type Extremes',
  'All null props (bypassed with as any)',
  {
    step: null as any,
    airwayStatus: null as any,
    airflowPercent: null as any,
    spo2Percent: null as any,
    isBrainArousal: null as any,
    isSympathetic: null as any,
  },
  {
    'data-brain-arousal': 'false',
    'data-sympathetic': 'false',
  }
);

testPropCase(
  'Adversarial: Type Extremes',
  'All undefined props (bypassed with as any)',
  {
    step: undefined as any,
    airwayStatus: undefined as any,
    airflowPercent: undefined as any,
    spo2Percent: undefined as any,
    isBrainArousal: undefined as any,
    isSympathetic: undefined as any,
  },
  {
    'data-brain-arousal': 'false',
    'data-sympathetic': 'false',
  }
);

testPropCase(
  'Adversarial: Type Extremes',
  'Completely empty object ({}) passed as props',
  {} as any,
  {
    'data-brain-arousal': 'false',
    'data-sympathetic': 'false',
  }
);

// 8. Adversarial Stress Probe: NaN Handling
console.log('\nTesting adversarial NaN probe...');
const nanRun = runWithConsoleSpy(() => {
  return ReactDOMServer.renderToString(
    React.createElement(AnatomyScene3D, {
      step: NaN,
      airwayStatus: 'collapsed',
      airflowPercent: NaN,
      spo2Percent: NaN,
      isBrainArousal: false,
      isSympathetic: false,
    })
  );
});
console.log(`  NaN Probe Render Succeeded: ${nanRun.result !== null}`);
console.log(`  React 19 Warning emitted on raw numeric NaN attribute: ${nanRun.warnings.length > 0}`);
if (nanRun.warnings.length > 0) {
  console.log(`  Captured React Warning: "${nanRun.warnings[0]}"`);
}

// Report summary
const total = results.length;
const passedCount = results.filter(r => r.passed).length;
const failedCount = total - passedCount;
const warningsCount = results.reduce((acc, r) => acc + r.warnings.length, 0);

console.log(`\n================== SUMMARY ==================`);
console.log(`Total Scenarios: ${total}`);
console.log(`Passed:          ${passedCount}`);
console.log(`Failed:          ${failedCount}`);
console.log(`React Warnings:  ${warningsCount}`);
console.log(`=============================================\n`);

if (failedCount > 0 || warningsCount > 0) {
  console.log('FAILURES / WARNINGS:');
  for (const r of results.filter(r => !r.passed || r.warnings.length > 0)) {
    console.log(`[${r.category}] ${r.name}`);
    if (r.error) console.log(`  Error: ${r.error}`);
    if (r.warnings.length > 0) console.log(`  Warnings: ${r.warnings.join('; ')}`);
  }
  process.exit(1);
} else {
  console.log('ALL EDGE CASES PASSED WITH 0 WARNINGS AND 0 EXCEPTIONS!');
  process.exit(0);
}
