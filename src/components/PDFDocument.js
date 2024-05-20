import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// pdf-renderer is not compatiable with MUI themes so define custm
const styles = StyleSheet.create({
    section: { textAlign: 'center', margin: 50 }
});

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