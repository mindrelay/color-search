import Vector from "./Vector";

interface PointsSimilarity {
    calculate(vec1: Vector, vec2: Vector, normalized: boolean): number;
}

/** Cosine similarity between two vectors */
class CosineSimilarity implements PointsSimilarity {

    /**
    * Calculates cosine similarity between two vectors
    * @param vector1 Vector1
    * @param vector2 Vector2
    * @param normalized Flag if both vectors are normalized.
    * If both vectors are normalized, the similarity value can be calculated faster
    * @return number
    */
    public calculate(vector1: Vector, vector2: Vector, normalized: boolean = false): number {
        let prod: number = 0;
        if (vector1 && vector2 && vector1.getDimensions() === vector2.getDimensions()) {
            for (let i = 0, j = vector1.getDimensions(); i < j; i++) {
                prod += vector1.get(i) * vector2.get(i);
            }
            return normalized ? prod : prod / (vector1.length() * vector2.length());
        }
        return 0;
    }
}

export {CosineSimilarity, PointsSimilarity};
