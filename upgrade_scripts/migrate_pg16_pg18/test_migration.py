"""Run with python3 -m unittest discover -s upgrade_scripts/migrate_pg16_pg18 -p 'test_*.py'."""
from pathlib import Path
import tempfile
import unittest

from migrate import normalize_dump


class NormalizeDumpTests(unittest.TestCase):
    def test_only_global_cleanup_is_adjusted_and_source_is_preserved(self):
        text = ('-- PostgreSQL database cluster dump\r\n'
                'DROP DATABASE pdq;\r\nDROP ROLE postgres;\r\nCREATE ROLE postgres;\r\n'
                'ALTER ROLE postgres WITH LOGIN;\r\nDROP ROLE "other role";\r\n'
                '-- PostgreSQL database dump\r\n'
                'COPY public.notes (text) FROM stdin;\r\nDROP ROLE postgres;\r\n\\.\r\n')
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory) / 'source.sql'
            target = Path(directory) / 'target.sql'
            source.write_bytes(text.encode())
            normalize_dump(source, target)
            result = target.read_text()
            self.assertEqual(source.read_bytes(), text.encode())
            self.assertIn('DROP DATABASE IF EXISTS pdq;', result)
            self.assertIn('DROP ROLE IF EXISTS "other role";', result)
            self.assertIn('ALTER ROLE postgres WITH LOGIN;', result)
            self.assertNotIn('CREATE ROLE postgres;', result)
            self.assertEqual(result.count('DROP ROLE postgres;'), 1)

    def test_rejects_a_single_database_dump(self):
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory) / 'source.sql'
            source.write_text('-- PostgreSQL database dump\nSELECT 1;\n')
            with self.assertRaisesRegex(RuntimeError, 'pg_dumpall'):
                normalize_dump(source, Path(directory) / 'target.sql')


if __name__ == '__main__':
    unittest.main()
