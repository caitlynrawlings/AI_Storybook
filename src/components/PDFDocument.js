import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// PDF-renderer is not compatiable with MUI themes so define custom style
const styles = StyleSheet.create({
    section: { textAlign: 'center', margin: 50 }
});

// Generates a page for each of the elements in pageContents to create
// single PDF document.
const PDFDocument = ({ pageContents }) => {
    return (
        <Document>
            {pageContents.map((pageContent, index) => (
                <Page key={index} size="A4">
                    <View style={styles.section}>
                        <Text>{pageContent}</Text>
                    </View>
                </Page>
            ))}
        </Document>
    );
};

export default PDFDocument;