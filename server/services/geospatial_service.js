/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

export default class GeospatialService {
  constructor(driver) {
    this.driver = driver;
  }

  uploadGeojson = async (context, req, res) => {
    // console.log(req, 'Print-----req-----uploadGeojson');
    const dataSourceRefId = req.query.dataSourceId;
    let uploadResponse;
    try {
      if (dataSourceRefId) {
        const apicaller = context.dataSource.opensearch.legacy.getClient(dataSourceRefId).callAPI;
        uploadResponse = await apicaller('geospatial.geospatialQuery', {
          body: req.body,
        });
        console.log(uploadResponse, 'Print-----uploadResponse-----uploadGeojson');
      } else {
        const { callAsCurrentUser } = await this.driver.asScoped(req);
        uploadResponse = await callAsCurrentUser('geospatial.geospatialQuery', {
          body: req.body,
        });
      }

      return res.ok({
        body: {
          ok: true,
          resp: uploadResponse,
        },
      });
    } catch (err) {
      return res.ok({
        body: {
          ok: false,
          resp: err.message,
        },
      });
    }
  };
}
