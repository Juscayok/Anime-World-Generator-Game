using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Security.Cryptography;
using System.Windows.Forms;

[assembly: AssemblyTitle("Anime World Generator")]
[assembly: AssemblyDescription("Anime World Generator 1.7 — offline anime wheel game")]
[assembly: AssemblyCompany("Anime World Generator")]
[assembly: AssemblyProduct("Anime World Generator")]
[assembly: AssemblyVersion("1.7.0.0")]
[assembly: AssemblyFileVersion("1.7.0.0")]
[assembly: AssemblyInformationalVersion("1.7")]

internal static class Program
{
    private const string Version = "1.7";
    private const string Prefix = "AWG.assets.";

    [STAThread]
    private static int Main(string[] args)
    {
        bool verifyOnly = args.Length == 2 && args[0] == "--verify-extract";
        if (args.Length != 0 && !verifyOnly) return 2;
        try
        {
            string directory = verifyOnly ? Path.GetFullPath(args[1]) : Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "AnimeWorldGenerator", Version);
            Directory.CreateDirectory(directory);
            Assembly assembly = Assembly.GetExecutingAssembly();
            string[] resources = assembly.GetManifestResourceNames()
                .Where(name => name.StartsWith(Prefix, StringComparison.Ordinal)).ToArray();
            if (resources.Length != 49) throw new InvalidDataException("The game package is incomplete.");

            foreach (string resource in resources)
            {
                string name = resource.Substring(Prefix.Length);
                if (name != Path.GetFileName(name)) throw new InvalidDataException("Invalid asset name.");
                string target = Path.Combine(directory, name);
                byte[] data;
                using (Stream source = assembly.GetManifestResourceStream(resource))
                using (var buffer = new MemoryStream())
                {
                    source.CopyTo(buffer);
                    data = buffer.ToArray();
                }
                if (!File.Exists(target) || !SameHash(data, File.ReadAllBytes(target)))
                {
                    string temporary = target + "." + Guid.NewGuid().ToString("N") + ".tmp";
                    try
                    {
                        File.WriteAllBytes(temporary, data);
                        if (File.Exists(target)) File.Replace(temporary, target, null);
                        else File.Move(temporary, target);
                    }
                    finally { if (File.Exists(temporary)) File.Delete(temporary); }
                }
                if (!SameHash(data, File.ReadAllBytes(target)))
                    throw new IOException("Could not verify " + name);
            }
            string index = Path.Combine(directory, "index.html");
            if (!File.ReadAllText(index).Contains("Version 1.7"))
                throw new InvalidDataException("The application version does not match the launcher.");
            if (verifyOnly) return 0;
            Process.Start(new ProcessStartInfo(index) { UseShellExecute = true });
            return 0;
        }
        catch (Exception error)
        {
            if (verifyOnly) { Console.Error.WriteLine(error.ToString()); return 1; }
            MessageBox.Show("Anime World Generator could not start.\n\n" + error.Message,
                "Anime World Generator v" + Version, MessageBoxButtons.OK, MessageBoxIcon.Error);
            return 1;
        }
    }

    private static bool SameHash(byte[] first, byte[] second)
    {
        using (SHA256 sha = SHA256.Create())
            return sha.ComputeHash(first).SequenceEqual(sha.ComputeHash(second));
    }
}
