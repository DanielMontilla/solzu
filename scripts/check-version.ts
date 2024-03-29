const decoder = new TextDecoder("utf-8");

// Read the package.json file
const packageContent = await Deno.readFile("./package.json");
const packageJson = JSON.parse(decoder.decode(packageContent));
const currentVersion = packageJson.version;

// Fetch the version from the npm registry
const response = await fetch(`https://registry.npmjs.org/${packageJson.name}`);
const data = await response.json();
const npmVersion = data["dist-tags"].latest;

if (currentVersion <= npmVersion) {
  console.error(`::error ::Make sure the current version (${currentVersion}) is  greater than the published version (${npmVersion})`);
  Deno.exit(1);
} else {
  console.log(`::notice ::Current version (${currentVersion} is greater than the published version (${npmVersion})!`);
}
